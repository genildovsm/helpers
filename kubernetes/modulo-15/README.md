# Kyverno e as Policies no K8s

### Kyverno - Como fazer o seu cluster Kubernetes mais seguro

Kyverno é uma ferramenta de gerenciamento de políticas para Kubernetes, focada na automação de várias tarefas relacionadas à segurança e configuração dos clusters de Kubernetes. Ele permite que você defina, gerencie e aplique políticas de forma declarativa para garantir que os clusters e suas cargas de trabalho estejam em conformidade com as regras e normas definidas.

**Principais Funções do Kyverno:**

- Validação de Recursos: Verifica se os recursos do Kubernetes estão em conformidade com as políticas definidas. Por exemplo, pode garantir que todos os Pods tenham limites de CPU e memória definidos.

- Mutação de Recursos: Modifica automaticamente os recursos do Kubernetes para atender às políticas definidas. Por exemplo, pode adicionar automaticamente labels específicos a todos os novos Pods.

- Geração de Recursos: Cria recursos adicionais do Kubernetes com base nas políticas definidas. Por exemplo, pode gerar NetworkPolicies para cada novo Namespace criado.

## Instalando o Kyverno

A instalação do Kyverno em um cluster Kubernetes pode ser feita de várias maneiras, incluindo a utilização de um gerenciador de pacotes como o Helm, ou diretamente através de arquivos YAML. Aqui estão os passos básicos para instalar o Kyverno:

#### Utilizando Helm

O Helm é um gerenciador de pacotes para Kubernetes, que facilita a instalação e gerenciamento de aplicações. Para instalar o Kyverno com Helm, siga estes passos:

Adicione o Repositório do Kyverno:

~~~sh
helm repo add kyverno https://kyverno.github.io/kyverno/
helm repo update
~~~

Instale o Kyverno:

Você pode instalar o Kyverno no namespace kyverno usando o seguinte comando:

~~~sh
helm install kyverno kyverno/kyverno --namespace kyverno --create-namespace
~~~

### Verificando a Instalação

Após a instalação, é importante verificar se o Kyverno foi instalado corretamente e está funcionando como esperado.

Verifique os Pods:

~~~sh
kubectl get pods -n kyverno
~~~

Este comando deve mostrar os pods do Kyverno em execução no namespace especificado.

Verifique os CRDs:

~~~sh
kubectl get crd | grep kyverno
~~~

Este comando deve listar os CRDs relacionados ao Kyverno, indicando que foram criados corretamente.

- Lembrando que é sempre importante consultar a documentação oficial para obter as instruções mais atualizadas e detalhadas, especialmente se estiver trabalhando com uma configuração específica ou uma versão mais recente do Kyverno ou do Kubernetes.