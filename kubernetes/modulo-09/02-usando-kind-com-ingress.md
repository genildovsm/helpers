# Usando KinD com Ingress

### Introdução

KinD é uma ferramenta muito útil para testes e desenvolvimento com Kubernetes. Nesta seção atualizada, fornecemos detalhes específicos para garantir que o Ingress funcione como esperado em um cluster KinD.

### Criando o Cluster com Configurações Especiais

Ao criar um cluster KinD, podemos especificar várias configurações que incluem mapeamentos de portas e rótulos para nós.

Crie um arquivo chamado `kind-config.yaml` com o conteúdo abaixo:

~~~yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane
  kubeadmConfigPatches:
  - |
    kind: InitConfiguration
    nodeRegistration:
      kubeletExtraArgs:
        node-labels: "ingress-ready=true"
  extraPortMappings:
  - containerPort: 80
    hostPort: 80
    protocol: TCP
  - containerPort: 443
~~~

Em seguida, crie o cluster usando este arquivo de configuração:

~~~sh
kind create cluster --config kind-config.yaml
~~~

### Instalando um Ingress Controller

Vamos continuar usando o Nginx Ingress Controller como exemplo, que é amplamente adotado e bem documentado.

~~~sh
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/static/provider/kind/deploy.yaml
~~~

Você pode utilizar a opção wait do kubectl, assim quando os pods estiverem prontos, ele irá liberar o shell, veja:

~~~sh
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=90s
~~~

No comando acima, estamos esperando que os pods do Ingress Controller estejam prontos, com o label **app.kubernetes.io/component=controller**, no namespace **ingress-nginx**, e caso não estejam prontos em 90 segundos, o comando irá falhar.

