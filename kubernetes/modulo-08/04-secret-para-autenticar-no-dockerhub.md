# Criando um Secret para armazenar credenciais Docker

O Docker Hub é um serviço de registro de imagens Docker, que permite que você armazene e compartilhe imagens Docker publicamente ou privadamente. Em 2022, o Docker Hub começou a limitar o número de downloads de imagens Docker públicas para 100 downloads por 6 horas para usuários não autenticados, e para usuários autenticados, o limite é de 200 downloads por 6 horas.

Mas o ponto aqui é que você pode usar o Docker Hub para armazenar imagens Docker privadas, e para isso você precisa de uma conta no Docker Hub, e para acessar a sua conta no Docker Hub, você precisa de um nome de usuário e uma senha. Entendeu onde eu quero chegar? :D

Para que o Kubernetes possa acessar o Docker Hub, você precisa criar um Secret que armazene o nome de usuário e a senha da sua conta no Docker Hub, e depois você precisa configurar o Kubernetes para usar esse Secret.

Quando você executa docker login e tem a sua autenticação bem sucedida, o Docker cria um arquivo chamado config.json no diretório ~/.docker/ do seu usuário, e esse arquivo contém o nome de usuário e a senha da sua conta no Docker Hub, e é esse arquivo que você precisa usar para criar o seu Secret.

Primeiro passo é pegar o conteúdo do seu arquivo config.json e codificar em base64, e para isso você pode usar o comando **base64**:

~~~sh
base64 ~/.docker/config.json

QXF1aSB0ZW0gcXVlIGVzdGFyIG8gY29udGXDumRvIGRvIHNldSBjb25maWcuanNvbiwgY29pc2EgbGluZGEgZG8gSmVmaW0=
~~~

Então vamos lá! Crie um arquivo chamado dockerhub-secret.yaml com o seguinte conteúdo:

~~~yaml
apiVersion: v1
kind: Secret
metadata:
  name: docker-hub-secret # nome do Secret
type: kubernetes.io/dockerconfigjson # tipo do Secret, neste caso é um Secret que armazena credenciais Docker
data:
  .dockerconfigjson: |  # substitua este valor pelo conteúdo do seu arquivo config.json codificado em base64
    QXF1aSB0ZW0gcXVlIGVzdGFyIG8gY29udGXDumRvIGRvIHNldSBjb25maWcuanNvbiwgY29pc2EgbGluZGEgZG8gSmVmaW0=
~~~

O que temos de novo aqui é no campo type, que define o tipo do Secret, e neste caso é um Secret que armazena credenciais Docker, e no campo data temos o campo dockerconfigjson, que é o nome do campo do Secret que armazena o conteúdo do arquivo config.json codificado em base64.

Agora vamos criar o Secret usando o comando kubectl apply:

~~~sh
kubectl apply -f dockerhub-secret.yaml

secret/docker-hub-secret created
~~~

Para listar o Secret que acabamos de criar, você pode usar o comando kubectl get:

~~~sh
kubectl get secrets

NAME                TYPE                             DATA   AGE
docker-hub-secret   kubernetes.io/dockerconfigjson   1      1s
~~~

**Secret criada, agora já podemos testar o acesso ao Docker Hub!**

Agora o Kubernetes já tem acesso ao Docker Hub, e você pode usar o Kubernetes para fazer o pull de imagens Docker privadas do Docker Hub.

Um coisa importante, sempre quando você precisar criar um Pod que precise utilizar uma imagem Docker privada do Docker Hub, você precisa configurar o Pod para usar o Secret que armazena as credenciais do Docker Hub, e para isso você precisa usar o campo `spec.imagePullSecrets` no arquivo YAML do Pod.

~~~yaml
apiVersion: v1
kind: Pod
metadata:
  name: meu-pod
spec:
  containers:
  - name: meu-container
    image: minha-imagem-privada
  imagePullSecrets: # campo que define o Secret que armazena as credenciais do Docker Hub
  - name: docker-hub-secret # nome do Secret
~~~

Perceba a utilização do campo `spec.imagePullSecrets` no arquivo YAML do Pod, e o campo `name` que define o nome do Secret que armazena as credenciais do Docker Hub. É somente isso que você precisa fazer para que o Kubernetes possa acessar o Docker Hub.