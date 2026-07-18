# Criando um Secret TLS

O Secret **kubernetes.io/tls**, é usado para armazenar certificados TLS e chaves privadas. Eles são usados para fornecer segurança na comunicação entre os serviços no Kubernetes. Por exemplo, você pode usar um Secret TLS para configurar o HTTPS no seu serviço web.

Para criar um Secret TLS, você precisa ter um certificado TLS e uma chave privada, e você precisa codificar o certificado e a chave privada em base64, para então criar o Secret.

Vamos criar um Secret TLS para o nosso serviço web, mas para isso, você precisa ter um certificado TLS e uma chave privada antes de mais nada.

Para criar um certificado TLS e uma chave privada, você pode usar o comando **openssl**:

~~~sh
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout chave-privada.key -out certificado.crt
~~~ 

No comando acima, estamos criando um certificado TLS e uma chave privada, e o certificado e a chave privada serão armazenados nos arquivos certificado.crt e chave-privada.key, respectivamente. Você pode substituir os nomes dos arquivos por qualquer nome que você quiser. Estamos usando o comando openssl para criar um certificado TLS auto-assinado, e para isso você precisa responder algumas perguntas, como o país, estado, cidade, etc. Você pode responder qualquer coisa, não tem problema. Esse certificado TLS auto-assinado é apenas para fins de teste, e não deve ser usado em produção. Estamos passando o parâmetro -nodes para que a chave privada não seja criptografada com uma senha, e o parâmetro -days para definir a validade do certificado TLS, que neste caso é de 365 dias. Já o parâmetro -newkey é usado para definir o algoritmo de criptografia da chave privada, que neste caso é o rsa:2048, que é um algoritmo de criptografia assimétrica que usa chaves de 2048 bits.

Eu não quero entrar em detalhes sobre como o que é um certificado TLS e uma chave privada, mas, basicamente, um certificado TLS (Transport Layer Security) é usado para autenticar e estabelecer uma conexão segura entre duas partes, como um cliente e um servidor. Ele contém informações sobre a entidade para a qual foi emitido e a entidade que o emitiu, bem como a chave pública da entidade para a qual foi emitido.

A chave privada, por outro lado, é usada para descriptografar a informação que foi criptografada com a chave pública. Ela deve ser mantida em segredo e nunca compartilhada, pois qualquer pessoa com acesso à chave privada pode decifrar a comunicação segura. Juntos, o certificado TLS e a chave privada formam um par de chaves que permite a autenticação e a comunicação segura entre as partes.

Entendido? Espero que sim, porque eu não vou entrar em mais detalhes sobre isso. hahaha

**Agora vamos voltar o foco na criação do Secret TLS.**

Com o certificado TLS e a chave privada criados, vamos criar o nosso Secret, é somente para mudar um pouco, vamos criar o Secret usando o comando kubectl apply:

~~~sh
kubectl create secret tls meu-servico-web-tls-secret --cert=certificado.crt --key=chave-privada.key

secret/meu-servico-web-tls-secret created
~~~

Vamos ver se o Secret foi criado:

~~~sh
kubectl get secrets
NAME                         TYPE                             DATA   AGE
meu-servico-web-tls-secret   kubernetes.io/tls                2      4s
~~~

Sim, o Secret está lá e é do tipo kubernetes.io/tls.

Caso você queira ver o conteúdo do Secret, você pode usar o comando kubectl get secret com o parâmetro -o yaml:

~~~sh
kubectl get secret meu-servico-web-tls-secret -o yaml
~~~

Agora você pode usar esse Secret para ter o Nginx rodando com HTTPS, e para isso você precisa usar o campo spec.tls no arquivo YAML do Pod:

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
        - name: nginx-config-volume
          mountPath: /etc/nginx/nginx.conf
          subPath: nginx.conf
        - name: nginx-tls
          mountPath: /etc/nginx/tls
    volumes:
    - name: nginx-config-volume
      configMap:
        name: nginx-config
    - name: nginx-tls
      secret:
        secretName: meu-servico-web-tls-secret
        items:
          - key: certificado.crt
            path: certificado.crt
          - key: chave-privada.key
            path: chave-privada.key
~~~

Aqui temos bastante informação nova, então vamos por partes.

Primeira coisa que temos que falar é sobre o spec.containers, principalmente sobre os volumes, que é o campo **spec.containers.volumeMounts**.

O campo **spec.containers.volumeMounts** é usado para montar um volume em um diretório dentro do container. No nosso caso, estamos montando dois volumes, um para o arquivo de configuração do Nginx, e outro para o certificado TLS e a chave privada.

E usamos o campo **spec.volumes** para definir os volumes que serão usados pelo Pod, e estamos definindo dois volumes, o **nginx-config-volume** e o **nginx-tls**.

O volume **nginx-config-volume** é um volume do tipo configMap, e ele é usado para montar o arquivo de configuração do Nginx, que está armazenado no ConfigMap **nginx-config.** O próximo tópico é sobre ConfigMaps, então não se preocupe com isso agora.

Já o volume **nginx-tls** é um volume do tipo secret, e ele é usado para montar o Secret **meu-servico-web-tls-secret**, que contém o certificado TLS e a chave privada que serão usados para configurar o HTTPS no Nginx.

E como estamos configurando um Nginx para usar o nosso Secret, precisamos falar onde queremos que os arquivos do Secret sejam montados, e para isso usamos o campo **spec.containers.volumeMounts.path** para definir o diretório onde queremos que os arquivos do Secret sejam montados, que neste caso é o diretório **/etc/nginx/tls**.

Falei que o volume **nginx-config-volume**, é um volume do tipo **configMap**, isso é uma ótima deixa para eu iniciar o próximo tópico, que é sobre ConfigMaps! :D

Sendo assim, bora continuar o nosso exemplo de como usar o Nginx com HTTPS, mas no próximo tópico sobre ConfigMaps.