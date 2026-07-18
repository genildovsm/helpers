# O que é o Helm?

O Helm é um gerenciador de pacotes para Kubernetes que facilita a definição, instalação e atualização de aplicações complexas no Kubernetes. Com ele você pode definir no detalhe como a sua aplicação será instalada, quais configurações serão utilizadas e como será feita a atualização da aplicação.

Mas para que você possa utilizar o Helm, a primeira coisa é fazer a sua instalação. Vamos ver como realizar a instalação do Helm na sua máquina Linux.

Lembrando que o Helm é um projeto da CNCF e é mantido pela comunidade, ele funciona em máquinas Linux, Windows e MacOS.

Para realizar a instalação no Linux, podemos utilizar diferentes formas, como baixar o binário e instalar manualmente, utilizar o gerenciador de pacotes da sua distribuição ou utilizar o script de instalação preparado pela comunidade.

Vamos ver como realizar a instalação do Helm no Linux utilizando o script de instalação, mas fique a vontade de utilizar a forma que você achar mais confortável, e tire todas as suas dúvidas no site da documentação oficial do Helm.

**Para fazer a instalação, vamos fazer o seguinte:**

~~~sh
curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
chmod 700 get_helm.sh
./get_helm.sh
~~~

Com o comando acima, você irá baixar o script de instalação utilizando o curl, dar permissão de execução para o script e executar o script para realizar a instalação do Helm na sua máquina.

A saída será algo assim:

~~~sh
Downloading https://get.helm.sh/helm-v3.14.0-linux-amd64.tar.gz
Verifying checksum... Done.
Preparing to install helm into /usr/local/bin
helm installed into /usr/local/bin/helm
~~~

Vamos ver se a instalação foi realizada com sucesso, executando o comando **helm version**:

~~~sh
helm version
~~~

No meu caso, no momento de criação desse material eu tenho a seguinte saída:

~~~sh
version.BuildInfo{Version:"v3.14.0", GitCommit:"3fc9f4b2638e76f26739cd77c7017139be81d0ea", GitTreeState:"clean", GoVersion:"go1.21.5"}
~~~

Pronto, agora que já temos o Helm instalado, já podemos começar a nossa brincadeira.

Durante o dia de hoje, eu quero ensinar o Helm de uma maneira diferente do que estamos acostumados a ver por aí. Vamos focar inicialmente na criação de Charts, e depois vamos ver como instalar e atualizar aplicações utilizando o Helm, de uma maneira mais natural e prática.

### O que é um Chart?

Um Chart é um pacote que contém informações necessárias para criar instâncias de aplicações Kubernetes. É com ele que iremos definir como a nossa aplicação será instalada, quais configurações serão utilizadas e como será feita a atualização da aplicação.

Um Chart, normalmente é composto por um conjunto de arquivos que definem a aplicação, e um conjunto de templates que definem como a aplicação será instalada no Kubernetes.

Vamos parar de falar e vamos criar o nosso primeiro Chart, acho que ficará mais fácil de entender.

- [01 - Criando o primeiro Chart](./01-criando-nosso-primeiro-chart.md)
- [02 - Fazendo o deploy do nosso Chart](./02-fazendo-o-deploy-do-nosso-chart.md)
- [03 - Refatorando o nosso Values](./03-refatorando-o-nosso-value.md)