# Criando nosso primeiro Secret

Agora que você já sabe o que são os Secrets, já entender que Base64 não é criptografia e já sabe como codificar e decodificar uma string usando o Base64, vamos criar o nosso primeiro Secret.

Primeiro, vamos criar um Secret do tipo Opaque. Este é o tipo de Secret mais comum, usado para armazenar informações arbitrárias.

Para criar um Secret do tipo Opaque, você precisa criar um arquivo YAML que defina o Secret. Por exemplo, você pode criar um arquivo chamado giropops-secret.yaml com o seguinte conteúdo:

~~~yaml
apiVersion: v1
kind: Secret
metadata:
  name: giropops-secret
type: Opaque
data: # Inicio dos dados
    username: SmVmZXJzb25fbGluZG8=
    password: Z2lyb3BvcHM=
~~~

O arquivo acima define um Secret chamado giropops-secret com dois campos de dados chamados username e password. O campo password contém a string giropops codificada em Base64. A minha pergunta é: qual é o valor do campo username?

Caso você descubra, eu desafio você a fazer um Tweet ou um post em outra rede social com o valor do campo username e as hashtags #desafioDay8 e #DescomplicandoKubernetes. Se você fizer isso, eu vou te dar um prêmio, mas não vou falar qual é o prêmio, pois isso é um segredo! :D

Outra informação importante que passamos para esse Secret foi o seu tipo, que é Opaque. Você pode ver que o tipo do Secret é definido no campo type do arquivo YAML.

Agora que você já criou o arquivo YAML, você pode criar o Secret usando o comando `kubectl create` ou `kubectl apply`. Por exemplo, para criar o Secret usando o comando kubectl create, vá com o seguinte comando:

~~~sh
kubectl create -f giropops-secret.yaml

secret/giropops-secret created
~~~

Pronto, o nosso primeiro Secret foi criado! Agora você pode ver o Secret usando o comando kubectl get:

~~~sh
kubectl get secret giropops-secret

NAME              TYPE     DATA   AGE
giropops-secret   Opaque   2      10s
~~~ 

A saída traz o nome do Secret, o seu tipo, a quantidade de dados que ele armazena e a quanto tempo ele foi criado.

Caso você queira ver os dados armazenados no Secret, você pode usar o comando kubectl get com a opção -o yaml:

~~~sh
kubectl get secret giropops-secret -o yaml

apiVersion: v1
data:
  password: Z2lyb3BvcHM=
  username: SmVmZXJzb25fbGluZG8=
kind: Secret
metadata:
  creationTimestamp: "2023-05-21T10:38:39Z"
  name: giropops-secret
  namespace: default
  resourceVersion: "466"
  uid: ac816e95-8896-4ad4-9e64-4ee8258a8cda
type: Opaque
~~~

Simples assim! Portanto, mais uma vez, os dados armazenados no Secret não são criptografados e podem ser facilmente decodificados por qualquer pessoa que tenha acesso ao Secret, portanto, é fundamental controlar o acesso aos Secrets e não armazenar informações sensíveis neles.

Você também pode ver os detalhes do Secret usando o comando kubectl describe:

~~~sh
kubectl describe secret giropops-secret

Name:         giropops-secret
Namespace:    default
Labels:       <none>
Annotations:  <none>

Type:  Opaque

Data
====
password:  8 bytes
username:  15 bytes
~~~

A saída do comando kubectl describe é muito parecido com o conteúdo do arquivo YAML que você criou para definir o Secret, mas com algumas informações adicionais, como o namespace do Secret, os labels e as annotations, coisas que você também pode definir no arquivo YAML.

Caso você queira criar esse mesmo Secret usando o comando kubectl create secret, você pode executar o seguinte comando:

~~~sh
kubectl create secret generic giropops-secret --from-literal=username=<SEGREDO> --from-literal=password=giropops
~~~

Fácil, aqui estamos usando o parâmetro `--from-literal` para definir os dados do Secret. Outras opções são `--from-file` e `--from-env-file`, que você pode usar para definir os dados do Secret a partir de um arquivo ou de variáveis de ambiente.

Se você comparar as strings dos campos `username` e `password` do Secret criado usando o comando `kubectl create secret` com as strings dos campos `username` e `password` do Secret criado usando o arquivo YAML, você perceberá que são iguais. Isso acontece porque o comando `kubectl create secret` codifica os dados em Base64 automaticamente.