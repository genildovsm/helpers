FROM golang:1.21.0-alpine3.18 as build
WORKDIR /build
COPY . .
RUN go build -o webtest

FROM alpine:3.18 as final
WORKDIR /app
COPY --from=build /build/webtest .
CMD ["./webtest"]
