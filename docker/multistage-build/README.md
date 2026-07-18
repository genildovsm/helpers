**Criar a imagem**

Exemplo de Dockerfile para uma aplicação web escrita em Go, supondo que o código fonte está no diretório do host (contexto).

~~~Dockerfile
FROM golang:1.21.0-alpine3.18 as build
WORKDIR /build
COPY . .
RUN go build -o webtest

FROM alpine:3.18 as final
WORKDIR /app
COPY --from=build /build/webtest .
CMD ["./webtest"]
~~~

Criando a imagem a partir do manifesto.

~~~sh
docker build -t genildovsm/webtest:multistage-1.0.0 .
~~~

A imagem final será o conteúdo do último estágio. Por isso ela fica com tamanho reduzido.

Caso deseje criar uma image a partir do mesmo manifesto, porém somente com o conteúdo do primeiro estágio "build", segue o comando.

~~~sh
docker build -t genildovsm/webtest:multistage-1.0.0 --target build .
~~~

A imagem irá conter todos os componentes do primeiro estágio (arquivos e ferramentas).