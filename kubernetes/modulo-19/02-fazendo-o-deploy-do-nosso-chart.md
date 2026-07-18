# Instalando o nosso Chart

Para que possamos utilizar o nosso Chart, precisamos utilizar o comando **helm install**, que é o comando que utilizamos para instalar um Chart no Kubernetes.

Vamos instalar o nosso Chart, para isso, execute o comando abaixo:

~~~sh
helm install giropops-senhas ./
~~~

Se tudo ocorrer bem, você verá a seguinte saída:

~~~yaml
NAME: giropops-senhas
LAST DEPLOYED: Thu Feb  8 16:37:58 2024
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
~~~

O nosso Chart foi instalado com sucesso!

Vamos listar os Pods para ver se eles estão rodando, execute o comando abaixo:

~~~sh
kubectl get pods
~~~

A saída será algo assim:

~~~sh
NAME                                READY   STATUS    RESTARTS      AGE
giropops-senhas-7d4fddc49f-9zfj9    1/1     Running   0             42s
giropops-senhas-7d4fddc49f-dn996    1/1     Running   0             42s
giropops-senhas-7d4fddc49f-fpvh6    1/1     Running   0             42s
redis-deployment-76c5cdb57b-wf87q   1/1     Running   0             42s
~~~

Perceba que temos 3 Pods rodando para a nossa aplicação Giropops-Senhas, e 1 Pod rodando para o Redis, conforme definimos no arquivo `values.yaml`.

Agora vamos listar os Charts que estão instalados no nosso Kubernetes, para isso, execute o comando abaixo:

~~~sh
helm list
~~~

Se você quiser ver de alguma namespace específica, você pode utilizar o comando `helm list -n <namespace>`, mas no nosso caso, como estamos utilizando a namespace default, não precisamos especificar a namespace.

Para ver mais detalhes do Chart que instalamos, você pode utilizar o comando **helm get**, para isso, execute o comando abaixo:

~~~sh
helm get all giropops-senhas
~~~

A saída será os detalhes do Chart e os manifestos que foram renderizados pelo Helm.

Vamos fazer uma alteração no nosso Chart, e vamos ver como atualizar a nossa aplicação utilizando o Helm.

