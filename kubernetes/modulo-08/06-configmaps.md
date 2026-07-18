# ConfigMaps

ConfigMaps são usados para armazenar dados de configuração, como variáveis de ambiente, arquivos de configuração, etc. Eles são muito úteis para armazenar dados de configuração que podem ser usados por vários Pods.

Os ConfigMaps são uma maneira eficiente de desacoplar os parâmetros de configuração das imagens de container. Isso permite que você tenha a mesma imagem de container em diferentes ambientes, como desenvolvimento, teste e produção, com diferentes configurações.

**Aqui estão alguns pontos importantes sobre o uso de ConfigMaps no Kubernetes:**

- Atualizações: Os ConfigMaps não são atualizados automaticamente nos pods que os utilizam. Se você atualizar um ConfigMap, os pods existentes não receberão a nova configuração. Para que um pod receba a nova configuração, você precisa recriar o pod.

- Múltiplos ConfigMaps: É possível usar múltiplos ConfigMaps para um único pod. Isso é útil quando você tem diferentes aspectos da configuração que quer manter separados.

- Variáveis de ambiente: Além de montar o ConfigMap em um volume, também é possível usar o ConfigMap para definir variáveis de ambiente para os containers no pod.

- Imutabilidade: A partir da versão 1.19 do Kubernetes, é possível tornar ConfigMaps (e Secrets) imutáveis, o que pode melhorar o desempenho de sua cluster se você tiver muitos ConfigMaps ou Secrets.

Como no exemplo do capítulo anterior, onde criamos um Pod com o Nginx, e usamos um ConfigMap para armazenar o arquivo de configuração do Nginx, o ConfigMap é usado para armazenar o arquivo de configuração do Nginx, ao invés de armazenar o arquivo de configuração dentro do Pod, tendo assim um Pod mais limpo e mais fácil de manter. E claro, sempre é bom usar as coisas para o que elas foram feitas, e o ConfigMap foi feito para armazenar dados de configuração.

Bora continuar o nosso exemplo de como usar o Nginx com HTTPS, mas agora usando um ConfigMap para armazenar o arquivo de configuração do Nginx.

Vamos criar o arquivo de configuração do Nginx chamado `nginx.conf`, que vai ser usado pelo ConfigMap:

~~~nginx

events { } # configuração de eventos

http { # configuração do protocolo HTTP, que é o protocolo que o Nginx vai usar
  server { # configuração do servidor
    listen 80; # porta que o Nginx vai escutar
    listen 443 ssl; # porta que o Nginx vai escutar para HTTPS e passando o parâmetro ssl para habilitar o HTTPS
    
    ssl_certificate /etc/nginx/tls/certificado.crt; # caminho do certificado TLS
    ssl_certificate_key /etc/nginx/tls/chave-privada.key; # caminho da chave privada

    location / { # configuração da rota /
      return 200 'Bem-vindo ao Nginx!\n'; # retorna o código 200 e a mensagem Bem-vindo ao Nginx!
      add_header Content-Type text/plain; # adiciona o header Content-Type com o valor text/plain
    } 
  }
}
~~~ 

Eu deixei o conteúdo do arquivo acima com comentários, para facilitar o entendimento.

**O que o arquivo acima está fazendo é:**

- Configurando o Nginx para escutar as portas 80 e 443, sendo que a porta 443 vai ser usada para o HTTPS.
- Configurando o Nginx para usar o certificado TLS e a chave privada que estão no diretório /etc/nginx/tls.
- Configurando a rota / para retornar o código 200 e a mensagem Bem-vindo ao Nginx! com o header Content-Type com o valor text/plain.
  
Agora vamos criar o ConfigMap nginx-config com o arquivo de configuração do Nginx:

~~~sh
kubectl create configmap nginx-config --from-file=nginx.conf
~~~

Simples demais, não? :)

O que estamos fazendo é criar um ConfigMap chamado nginx-config com o conteúdo do arquivo nginx.conf. Podemos fazer a mesma coisa através de um manifesto, como no exemplo abaixo:

~~~yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: nginx-config
data:
  nginx.conf: |
    events { }

    http {
      server {
        listen 80;
        listen 443 ssl;

        ssl_certificate /etc/nginx/tls/certificado.crt;
        ssl_certificate_key /etc/nginx/tls/chave-privada.key;

        location / {
          return 200 'Bem-vindo ao Nginx!\n';
          add_header Content-Type text/plain;
        }
      }
    }
~~~ 

O arquivo é bem parecido com os manifestos do Secret, mas com algumas diferenças:

- O campo kind é ConfigMap ao invés de Secret.
- O campo data é usado para definir o conteúdo do ConfigMap, e o campo data é um mapa de chave-valor, onde a chave é o nome do arquivo e o valor é o conteúdo do arquivo. Usamos o caractere | para definir o valor do campo data como um bloco de texto, e assim podemos definir o conteúdo do arquivo nginx.conf sem a necessidade de usar o caractere \n para quebrar as linhas do arquivo.
  
Agora é só aplicar o manifesto acima:

~~~sh
kubectl apply -f nginx-config.yaml
~~~

Para ver o conteúdo do ConfigMap que criamos, bastar executar o comando:

~~~sh
kubectl get configmap nginx-config -o yaml
~~~

Você também pode usar o comando kubectl describe configmap nginx-config para ver o conteúdo do ConfigMap, mas o comando `kubectl get configmap nginx-config -o yaml` é bem mais completo.

Agora que já temos o nosso ConfigMap criado, vamos aplicar o manifesto que criamos no capítulo anterior, vou colar aqui o manifesto para facilitar:

~~~yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  labels:
    app: nginx
spec:
  containers:
  - name: nginx
    image: nginx
    ports:
    - containerPort: 80
    - containerPort: 443
    volumeMounts:
    - name: nginx-config-volume # nome do volume que vamos usar para montar o arquivo de configuração do Nginx
      mountPath: /etc/nginx/nginx.conf # caminho onde o arquivo de configuração do Nginx vai ser montado
      subPath: nginx.conf # nome do arquivo de configuração do Nginx
    - name: nginx-tls # nome do volume que vamos usar para montar o certificado TLS e a chave privada
      mountPath: /etc/nginx/tls # caminho onde o certificado TLS e a chave privada vão ser montados
  volumes: # lista de volumes que vamos usar no Pod
  - name: nginx-config-volume # nome do volume que vamos usar para montar o arquivo de configuração do Nginx
    configMap: # tipo do volume que vamos usar
      name: nginx-config # nome do ConfigMap que vamos usar
  - name: nginx-tls # nome do volume que vamos usar para montar o certificado TLS e a chave privada
    secret: # tipo do volume que vamos usar
      secretName: meu-servico-web-tls-secret # nome do Secret que vamos usar
      items: # lista de arquivos que vamos montar, pois dentro da secret temos dois arquivos, o certificado TLS e a chave privada
        - key: tls.crt # nome do arquivo que vamos montar, nome que está no campo `data` do Secret
          path: certificado.crt # nome do arquivo que vai ser montado, nome que vai ser usado no campo `ssl_certificate` do arquivo de configuração do Nginx
        - key: tls.key # nome do arquivo que vamos montar, nome que está no campo `data` do Secret
          path: chave-privada.key # nome do arquivo que vai ser montado, nome que vai ser usado no campo `ssl_certificate_key` do arquivo de configuração do Nginx
~~~ 

Agora é só aplicar o manifesto acima:

~~~sh
kubectl apply -f nginx.yaml
~~~

Listando os Pods:

~~~sh
kubectl get pods
~~~

Agora precisamos criar um Service para expor o Pod que criamos:

~~~sh
kubectl expose pod nginx
~~~

Listando os Services:

~~~sh
kubectl get services
~~~

Bora fazer o port-forward para testar se o nosso Nginx está funcionando:

~~~sh
kubectl port-forward service/nginx 4443:443
~~~

O comando acima vai fazer o port-forward da porta 443 do Service nginx para a porta 4443 do seu computador, o port-forward salvando a nossa vida novamente! :)

Vamos usar o curl para testar se o nosso Nginx está funcionando:

~~~sh
curl -k https://localhost:4443

Bem-vindo ao Nginx!
~~~

Funcionando lindamente! Lembre-se que esse é um exemplo bem simples, o objetivo aqui é mostrar como usar o ConfigMap e o Secret para montar arquivos dentro de um Pod. O certificado TLS e a chave privada que usamos aqui são auto-assinados, e não são recomendados para uso em produção e não são aceitos pelos navegadores, mas para testar está ótimo.

Acho que já deu para entender como funciona o ConfigMap, e lembre-se que é possível usar o ConfigMap para montar arquivos, mas também é possível usar o ConfigMap para definir variáveis de ambiente, e isso é muito útil quando você precisa passar uma configuração para um container através de uma variável de ambiente.

Caso você queira tornar um ConfigMap imutável, você pode usar o campo **immutable** no manifesto do ConfigMap, como no exemplo abaixo:

~~~yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: nginx-config
  immutable: true # torna o ConfigMap imutável
data:
  nginx.conf: |
    events { }

    http {
      server {
        listen 80;
        listen 443 ssl;

        ssl_certificate /etc/nginx/tls/certificado.crt;
        ssl_certificate_key /etc/nginx/tls/chave-privada.key;

        location / {
          return 200 'Bem-vindo ao Nginx!\n';
          add_header Content-Type text/plain;
        }
      }
    }
~~~

Com isso, não será possível alterar o ConfigMap, e se você tentar alterar o ConfigMap, o Kubernetes vai retornar um erro.

Caso você queira deixar o ConfigMap em uma namespace específica, você pode usar o campo `namespace` no manifesto do ConfigMap, como no exemplo abaixo:

~~~yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: nginx-config
  namespace: minha-namespace # deixa o ConfigMap na namespace `minha-namespace`
data:
  nginx.conf: |
    events { }

    http {
      server {
        listen 80;
        listen 443 ssl;

        ssl_certificate /etc/nginx/tls/certificado.crt;
        ssl_certificate_key /etc/nginx/tls/chave-privada.key;

        location / {
          return 200 'Bem-vindo ao Nginx!\n';
          add_header Content-Type text/plain;
        }
      }
    }
~~~

Enfim, acho que já vimos bastante coisa sobre ConfigMap, acho que já podemos ir para o próximo assunto, certo? \o/