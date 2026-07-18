# Usando o nosso primeiro Secret

Agora que já temos o nosso primeiro Secret criado, é hora de saber como usa-lo em um Pod.

Nesse nosso primeiro exemplo, somente irei mostrar como usar o Secret em um Pod, mas ainda sem nenhuma "função" especial, apenas para mostrar como usar o Secret.

Para usar o Secret em um Pod, você precisa definir o campo **spec.containers[].env[].valueFrom.secretKeyRef** no arquivo YAML do Pod. Eu estou trazendo o campo nesse formato, para que você possa começar a se familiarizar com esse formato, pois você irá usa-lo bastante para buscar alguma informação mais especifica na linha de comando, usando o comando **kubectl get**, por exemplo.

Voltando ao assunto principal, precisamos criar o nosso Pod, então vamos lá! Crie um arquivo chamado `giropops-pod.yaml` com o seguinte conteúdo:

~~~yaml
apiVersion: v1
kind: Pod
metadata:
  name: giropops-pod
spec:
  containers:
  - name: giropops-container
    image: nginx
    env: # Inicio da definição das variáveis de ambiente
    - name: USERNAME # Nome da variável de ambiente que será usada no Pod
      valueFrom: # Inicio da definição de onde o valor da variável de ambiente será buscado
        secretKeyRef: # Inicio da definição de que o valor da variável de ambiente será buscado em um Secret, através de uma chave
          name: giropops-secret # Nome do Secret que contém o valor da variável de ambiente que será usada no Pod
          key: username # Nome da chave do campo do Secret que contém o valor da variável de ambiente que será usada no Pod
    - name: PASSWORD # Nome da variável de ambiente que será usada no Pod
      valueFrom: # Inicio da definição de onde o valor da variável de ambiente será buscado
        secretKeyRef: # Inicio da definição de que o valor da variável de ambiente será buscado em um Secret, através de uma chave
          name: giropops-secret # Nome do Secret que contém o valor da variável de ambiente que será usada no Pod
          key: password # Nome da chave do campo do Secret que contém o valor da variável de ambiente que será usada no Pod
~~~

Eu adicionei comentários nas linhas que são novas para você, para que você possa entender o que cada linha faz.

Mas vou trazer aqui uma explicação mais detalhada sobre o campo **spec.containers[].env[].valueFrom.secretKeyRef:**

- **spec.containers[].env[].valueFrom.secretKeyRef.name:** o nome do Secret que contém o valor da variável de ambiente que será usada no Pod;

- **spec.containers[].env[].valueFrom.secretKeyRef.key:** a chave do campo do Secret que contém o valor da variável de ambiente que será usada no Pod;

Com isso teremos um Pod, que terá um container chamado giropops-container, que terá duas variáveis de ambiente, USERNAME e PASSWORD, que terão os valores que estão definidos no Secret giropops-secret.

Agora vamos criar o Pod usando o comando `kubectl apply`:

~~~sh
kubectl apply -f giropops-pod.yaml

pod/giropops-pod created
~~~

Agora vamos verificar se o Pod foi criado e se os Secrets foram injetados no Pod:

~~~sh
kubectl get pods

NAME           READY   STATUS    RESTARTS   AGE
giropops-pod   1/1     Running   0          2m
~~~ 

Para verificar se os Secrets foram injetados no Pod, você pode usar o comando kubectl exec para executar o comando env dentro do container do Pod:

~~~sh
kubectl exec giropops-pod -- env

PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
HOSTNAME=giropops-pod
NGINX_VERSION=1.23.4
NJS_VERSION=0.7.11
PKG_RELEASE=1~bullseye
PASSWORD=giropops
USERNAME=CENSURADO
KUBERNETES_PORT_443_TCP_PROTO=tcp
KUBERNETES_PORT_443_TCP_PORT=443
KUBERNETES_PORT_443_TCP_ADDR=10.96.0.1
KUBERNETES_SERVICE_HOST=10.96.0.1
KUBERNETES_SERVICE_PORT=443
KUBERNETES_SERVICE_PORT_HTTPS=443
KUBERNETES_PORT=tcp://10.96.0.1:443
KUBERNETES_PORT_443_TCP=tcp://10.96.0.1:443
HOME=/root
~~~ 

Olha lá os nosso Secrets como variáveis de ambiente dentro do container do Pod!

Pronto! Tarefa executada com sucesso! \o/

Agora eu acho que já podemos partir para os próximos tipos de Secrets!