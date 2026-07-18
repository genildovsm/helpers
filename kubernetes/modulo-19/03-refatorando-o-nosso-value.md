# Atualizando o nosso Chart

Vamos fazer uma alteração no nosso Chart, e vamos ver como atualizar a nossa aplicação utilizando o Helm.

Vamos editar o **values.yaml** e alterar a quantidade de réplicas que estamos utilizando para a nossa aplicação Giropops-Senhas, para isso, edite o arquivo **values.yaml** e altere a quantidade de réplicas para 5:

~~~yaml
giropops-senhas:
  name: "giropops-senhas"
  image: "linuxtips/giropops-senhas:1.0"
  replicas: "5"
  port: 5000
  labels:
    app: "giropops-senhas"
    env: "labs"
    live: "true"
  service:
    type: "NodePort"
    port: 5000
    targetPort: 5000
    name: "giropops-senhas-port"
  resources:
    requests:
      memory: "128Mi"
      cpu: "250m"
    limits:
      memory: "256Mi"
      cpu: "500m"
redis:
  image: "redis"
  replicas: 1
  port: 6379
  labels:
    app: "redis"
    env: "labs"
    live: "true"
  service:
    type: "ClusterIP"
    port: 6379
    targetPort: 6379
    name: "redis-port"
  resources:
    requests:
      memory: "128Mi"
      cpu: "250m"
    limits:
      memory: "256Mi"
      cpu: "500m"
~~~

A única coisa que alteramos foi a quantidade de réplicas que estamos utilizando para a nossa aplicação Giropops-Senhas, de 3 para 5.

Vamos agora pedir para o Helm atualizar a nossa aplicação, para isso, execute o comando abaixo:

~~~sh
helm upgrade giropops-senhas ./
~~~

Se tudo ocorrer bem, você verá a seguinte saída:

~~~sh
Release "giropops-senhas" has been upgraded. Happy Helming!
NAME: giropops-senhas
LAST DEPLOYED: Thu Feb  8 16:46:26 2024
NAMESPACE: default
STATUS: deployed
REVISION: 2
TEST SUITE: None
~~~

Agora vamos ver se o número de réplicas foi alterado, para isso, execute o comando abaixo:

~~~sh
giropops-senhas-7d4fddc49f-9zfj9    1/1     Running   0             82s
giropops-senhas-7d4fddc49f-dn996    1/1     Running   0             82s
giropops-senhas-7d4fddc49f-fpvh6    1/1     Running   0             82s
redis-deployment-76c5cdb57b-wf87q   1/1     Running   0             82s
giropops-senhas-7d4fddc49f-ll25z    1/1     Running   0             18s
giropops-senhas-7d4fddc49f-w8p7r    1/1     Running   0             18s
~~~

Agora temos mais dois Pods em execução, da mesma forma que definimos no arquivo **values.yaml**.

Agora vamos remover a nossa aplicação:

~~~sh
helm uninstall giropops-senhas
~~~

A saída será algo assim:

~~~sh
release "giropops-senhas" uninstalled
~~~

Já era, a nossa aplicação foi removida com sucesso!

Como eu falei, nesse caso criamos tudo na mão, mas eu poderia ter usado o comando helm create para criar o nosso Chart, e ele teria criado a estrutura de diretórios e os arquivos que precisamos para o nosso Chart, e depois teríamos que fazer as alterações que fizemos manualmente.

A estrutura de diretórios que o helm create cria é a seguinte:

~~~text
giropops-senhas-chart/
├── charts
├── Chart.yaml
├── templates
│   ├── deployment.yaml
│   ├── _helpers.tpl
│   ├── hpa.yaml
│   ├── ingress.yaml
│   ├── NOTES.txt
│   ├── serviceaccount.yaml
│   ├── service.yaml
│   └── tests
│       └── test-connection.yaml
└── values.yaml
~~~

Eu não criei dessa forma, pois acho que iria complicar um pouco o nosso entendimento inicial, pois ele iria criar mais coisas que iriamos utilizar, mas em contrapartida, podemos utiliza-lo para nos basear para os nossos próximos Charts.
Ele é o nosso amigo, e sim, ele pode nos ajudar! hahaha

Agora eu preciso que você pratique o máximo possível, brincando com as diversas opções que temos disponíveis no Helm, e o mais importante, use e abuse da documentação oficial do Helm, ela é muito rica e tem muitos exemplos que podem te ajudar.

Bora deixar o nosso Chart ainda mais legal?