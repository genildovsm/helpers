# Criando o nosso primeiro Chart

Para o nosso exemplo, vamos usar novamente a aplicação de exemplo chamada Giropops-Senhas, que é uma aplicação que gera senhas aleatórias que criamos durante uma live no canal da LINUXtips.

Ela é uma aplicação simples, é uma aplicação em Python, mas especificamente uma aplicação Flask, que gera senhas aleatórias e exibe na tela. Ela utiliza um Redis para armazenar temporariamente as senhas geradas.

Simples como voar!

A primeira coisa que temos que fazer é clonar o repositório da aplicação, para isso, execute o comando abaixo:

~~~sh
git clone git@github.com:badtuxx/giropops-senhas.git
~~~

Com isso temos um diretório chamado giropops-senhas com o código da aplicação, vamos acessa-lo:

~~~sh
cd giropops-senhas
~~~

O conteúdo do diretório é o seguinte:

~~~sh
app.py  LICENSE  requirements.txt  static  tailwind.config.js  templates
~~~

Pronto, o nosso repo já está clonado, agora vamos começar com o nosso Chart.

A primeira coisa que iremos fazer, somente para facilitar o nosso entendimento, é criar os manifestos do Kubernetes para a nossa aplicação. Vamos criar um Deployment e um Service para o Giropops-Senhas e para o Redis.

Vamos começar com o Deployment do Redis, para isso, crie um arquivo chamado `redis-deployment.yaml` com o seguinte conteúdo:

~~~yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: redis
  name: redis-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
      - image: redis
        name: redis
        ports:
          - containerPort: 6379
        resources:
          limits:
            memory: "256Mi"
            cpu: "500m"
          requests:
            memory: "128Mi"
            cpu: "250m"
~~~

Agora vamos criar o Service do Redis, para isso, crie um arquivo chamado `redis-service.yaml` com o seguinte conteúdo:

~~~yaml
apiVersion: v1
kind: Service
metadata:
  name: redis-service
spec:
  selector:
    app: redis
  ports:
    - protocol: TCP
      port: 6379
      targetPort: 6379
  type: ClusterIP
~~~

Agora vamos criar o Deployment do Giropops-Senhas, para isso, crie um arquivo chamado `giropops-senhas-deployment.yaml` com o seguinte conteúdo:

~~~yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: giropops-senhas
  name: giropops-senhas
spec:
  replicas: 2
  selector:
    matchLabels:
      app: giropops-senhas
  template:
    metadata:
      labels:
        app: giropops-senhas
    spec:
      containers:
      - image: linuxtips/giropops-senhas:1.0
        name: giropops-senhas
        ports:
        - containerPort: 5000
        imagePullPolicy: Always
        resources:
          limits:
            memory: "256Mi"
            cpu: "500m"
          requests:
            memory: "128Mi"
            cpu: "250m"
~~~

E finalmente, vamos criar o Service do Giropops-Senhas, para isso, crie um arquivo chamado `giropops-senhas-service.yaml` com o seguinte conteúdo:

~~~yaml
apiVersion: v1
kind: Service
metadata:
  name: giropops-senhas
  labels:
    app: giropops-senhas
spec:
  selector:
    app: giropops-senhas
  ports:
    - protocol: TCP
      port: 5000
      nodePort: 32500
      targetPort: 5000
      name: tcp-app
  type: NodePort
~~~

Manifestos criados! Perceba que não temos nada de novo até agora, somente criamos os manifestos do Kubernetes para a nossa aplicação como já fizemos anteriormente.

Mas o pq eu fiz isso? Simples, para que você possa entender que um Chart é basicamente isso, um conjunto de manifestos do Kubernetes que definem como a sua aplicação será instalada no Kubernetes.

E você deve estar falando: Esse Jeferson está de brincadeira, pois eu já sei como fazer isso, cadê a novidade? Cadê o Helm? Calma calabrezo! 😄

Bem, a ideia de criar os manifestos é somente para nos guiar durante a criação do nosso Chart.

Com os arquivos para nos ajudar, vamos criar o nosso Chart.

Para criar o nosso Chart, poderiamos utilizar o comando **helm create**, mas eu quero fazer de uma maneira diferente, quero criar o nosso Chart na mão, para que você possa entender como ele é composto, e depois voltamos para o **helm create** para criar os nossos próximos Charts.

Bem, a primeira coisa que temos que fazer é criar um diretório para o nosso Chart, vamos criar um diretório chamado `giropops-senhas-chart`:

~~~sh
mkdir giropops-senhas-chart
~~~

Agora vamos acessar o diretório:

~~~sh
cd giropops-senhas-chart
~~~

Bem, agora vamos começar a criar a nossa estrutura de diretórios para o nosso Chart, e o primeiro cara que iremos criar é o Chart.yaml, que é o arquivo que contém as informações sobre o nosso Chart, como o nome, a versão, a descrição, etc.

Vamos criar o arquivo `Chart.yaml` com o seguinte conteúdo:

~~~yaml
apiVersion: v2
name: giropops-senhas
description: Esse é o chart do Giropops-Senhas, utilizados nos laboratórios de Kubernetes.
version: 0.1.0
appVersion: 0.1.0
sources:
  - https://github.com/badtuxx/giropops-senhas
~~~

Nada de novo até aqui, somente criamos o arquivo Chart.yaml com as informações sobre o nosso Chart. Agora vamos para o nosso próximo passo, criar o diretório templates que é onde ficarão os nossos manifestos do Kubernetes.

Vamos criar o diretório templates:

~~~sh
mkdir templates
~~~

Vamos mover os manifestos que criamos anteriormente para o diretório templates:

~~~sh
mv ../redis-deployment.yaml templates/
mv ../redis-service.yaml templates/
mv ../giropops-senhas-deployment.yaml templates/
mv ../giropops-senhas-service.yaml templates/
~~~

Vamos deixar eles quietinhos lá por enquanto, e vamos criar o próximo arquivo que é o `values.yaml`. Esse é uma peça super importante do nosso Chart, pois é nele que iremos definir as variáveis que serão utilizadas nos nossos manifestos do Kubernetes, é nele que o Helm irá se basear para criar os manifestos do Kubernetes, ou melhor, para renderizar os manifestos do Kubernetes.

Quando criamos os manifestos para a nossa App, nós deixamos ele da mesma forma como usamos para criar os manifestos do Kubernetes, mas agora, com o Helm, nós podemos utilizar variáveis para definir os valores que serão utilizados nos manifestos, e é isso que iremos fazer, e é isso que é uma das mágicas do Helm.

Vamos criar o arquivo `values.yaml` com o seguinte conteúdo:

~~~yaml
giropops-senhas:
  name: "giropops-senhas"
  image: "linuxtips/giropops-senhas:1.0"
  replicas: "3"
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

Não confunda o arquivo acima com os manifestos do Kubernetes, o arquivo acima é apenas algumas definições que iremos usar no lugar das variáveis que defineremos nos manifestos do Kubernetes.

Precisamos entender como ler o arquivo acima, e é bem simples, o arquivo acima é um arquivo YAML, e nele temos duas chaves, `giropops-senhas` e `redis`, e dentro de cada chave temos as definições que iremos utilizar, por exemplo:

- **giropops-senhas:**
  - **image:** A imagem que iremos utilizar para o nosso Deployment
  - **replicas:** A quantidade de réplicas que iremos utilizar para o nosso Deployment
  - **port:** A porta que iremos utilizar para o nosso Service
  - **labels:** As labels que iremos utilizar para o nosso Deployment
  - **service:** As definições que iremos utilizar para o nosso Service
  - **resources:** As definições de recursos que iremos utilizar para o nosso Deployment
- **redis:**
  - **image:** A imagem que iremos utilizar para o nosso Deployment
  - **replicas:** A quantidade de réplicas que iremos utilizar para o nosso Deployment
  - **port:** A porta que iremos utilizar para o nosso Service
  - **labels:** As labels que iremos utilizar para o nosso Deployment
  - **service:** As definições que iremos utilizar para o nosso Service
  - **resources:** As definições de recursos que iremos utilizar para o nosso Deployment

E nesse caso, caso eu queira usar o valor que está definido para image, eu posso utilizar a variável  no meu manifesto do Kubernetes, onde:

`.` : É a `variável que o Helm utiliza` para acessar as variáveis que estão definidas no arquivo `values.yaml`, e o resto é a chave que estamos acessando.

Entendeu? Eu sei que é meu confuso no começo, mas treinando irá ficar mais fácil.

Vamos fazer um teste rápido, como eu vejo o valor da porta que está definida para o Service do Redis?

Pensou?

Já sabemos que temos que começar com .Values, para representar o arquivo `values.yaml`, e depois temos que acessar a chave redis, e depois a chave service, e depois a chave port, então, o valor que está definido para a porta que iremos utilizar para o Service do Redis é .

Sempre você tem que respeitar a indentação do arquivo `values.yaml`, pois é ela que define como você irá acessar as chaves, certo?

Dito isso, já podemos começar a substituir os valores do que está definido nos manifestos do Kubernetes pelos valores que estão definidos no arquivo `values.yaml`. Iremos sair da forma estática para a forma dinâmica, é o Helm em ação!

Vamos começar com o arquivo `redis-deployment.yaml`, e vamos substituir o que está definido por variáveis, e para isso, vamos utilizar o seguinte conteúdo:

~~~yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels: 
    app: redis 
  name: redis-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
      - image: {{ .Values.redis.image }}
        name: redis
        ports:
          - containerPort: {{ .Values.redis.port }}
        resources:
          limits:
            memory: {{ .Values.redis.resources.limits.memory }}
            cpu: {{ .Values.redis.resources.limits.cpu }}
          requests:
            memory: {{ .Values.redis.resources.requests.memory }}
            cpu: {{ .Values.redis.resources.requests.cpu }}
~~~

Veja que estamos usando e abusando das variáveis que estão definidas no arquivo `values.yaml`, agora vou explicar o que estamos fazendo:

- `image`: Estamos utilizando a variável `{{ .Values.redis.image }}` para definir a imagem que iremos utilizar para o nosso Deployment
- `name`: Estamos utilizando a variável `{{ .Values.redis.name }}` para definir o nome que iremos utilizar para o nosso Deployment
- `replicas`: Estamos utilizando a variável `{{ .Values.redis.replicas }}` para definir a quantidade de réplicas que iremos utilizar para o nosso Deployment
- `resources`: Estamos utilizando as variáveis `{{ .Values.redis.resources.limits.memory }}`, `{{ .Values.redis.resources.limits.cpu }}`, `{{ .Values.redis.resources.requests.memory }}` e `{{ .Values.redis.resources.requests.cpu }}` para definir as definições de recursos que iremos utilizar para o nosso Deployment.
  
Com isso, ele irá utilizar os valores que estão definidos no arquivo **values.yaml** para renderizar o nosso manifesto do Kubernetes, logo, quando precisar alterar alguma configuração, basta alterar o arquivo **values.yaml**, e o Helm irá renderizar os manifestos do Kubernetes com os valores definidos.

Vamos fazer o mesmo para os outros manifestos do Kubernetes, e depois vamos ver como instalar a nossa aplicação utilizando o Helm.

Vamos fazer o mesmo para o arquivo `redis-service.yaml`:

~~~yaml
apiVersion: v1
kind: Service
metadata:
  name: redis-service
spec:
  selector:
    app: redis
  ports:
    - protocol: TCP
      port: {{ .Values.redis.service.port }}
      targetPort: {{ .Values.redis.service.port }}
  type: {{ .Values.redis.service.type }}
E para o arquivo giropops-senhas-deployment.yaml:

apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: giropops-senhas
  name: giropops-senhas
spec:
  replicas: {{ .Values.giropops-senhas.replicas }}
  selector:
    matchLabels:
      app: giropops-senhas
  template:
    metadata:
      labels:
        app: giropops-senhas
    spec:
      containers:
      - image: {{ .Values.giropops-senhas.image }}
        name: giropops-senhas
        ports:
        - containerPort: {{ .Values.giropops-senhas.service.port }}
        imagePullPolicy: Always
        resources:
          limits:
            memory: {{ .Values.giropops-senhas.resources.limits.memory }}
            cpu: {{ .Values.giropops-senhas.resources.limits.cpu }}
          requests:
            memory: {{ .Values.giropops-senhas.resources.requests.memory }}
            cpu: {{ .Values.giropops-senhas.resources.requests.cpu }}
~~~

E para o arquivo `giropops-senhas-service.yaml`:

~~~yaml
apiVersion: v1
kind: Service
metadata:
  name: giropops-senhas
  labels:
    app: giropops-senhas
spec:
  selector:
    app: giropops-senhas
  ports:
    - protocol: TCP
      port: {{ .Values.giropops-senhas.service.port }}
      nodePort: {{ .Values.giropops-senhas.service.nodePort }}
      targetPort: {{ .Values.giropops-senhas.service.port }}
  type: {{ .Values.giropops-senhas.service.type }}
~~~

Agora já temos todos os nosso manifestos mais dinâmicos, e portanto já podemos chamá-los de Templates, que é o nome que o Helm utiliza para os manifestos do Kubernetes que são renderizados utilizando as variáveis.

Ahhh, temos que criar um diretório chamado **charts** para que o Helm possa gerenciar as dependências do nosso **Chart**, mas como não temos dependências, podemos criar um diretório vazio, vamos fazer isso:

~~~sh
mkdir charts
~~~

Pronto, já temos o nosso Chart criado!

Agora vamos testa-lo para ver se tudo está funcionando como esperamos.