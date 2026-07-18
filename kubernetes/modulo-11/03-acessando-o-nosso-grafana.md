# Acessando o nosso Grafana

Agora que já temos o nosso Kube-Prometheus instalado, vamos acessar o nosso Grafana e verificar se está tudo funcionando corretamente. Para isso, vamos utilizar o **kubectl port-forward** para acessar o **Grafana** localmente. Para isso, basta executar o seguinte comando:

~~~sh
kubectl port-forward -n monitoring svc/grafana 33000:3000
~~~

Agora que já temos o nosso Grafana rodando localmente, vamos acessar o nosso Grafana através do navegador. Para isso, basta acessar a seguinte URL: **http://localhost:33000**

Para acessar o Grafana, vamos utilizar o usuário admin e a senha admin, e já no primeiro login ele irá pedir para você alterar a senha. Você já conhece o Grafana, não preciso mais apresenta-los, certo? 😄

O importante aqui é ver a quantidade de Dashboards criados pelo Kube-Prometheus. 😄
Temos Dashboards que mostram detalhes do API Server e de diversos componentes do Kubernetes, como Node, Pod, Deployment, etc.

Também temos Dashboards que mostram detalhes do nosso cluster EKS, como por exemplo o dashboard **Kubernetes/Compute Resources/Cluster**, que mostra detalhes de CPU e memória utilizados por todos os nós do nosso cluster EKS.

Dashboards que mostram detalhes do nosso cluster EKS, como por exemplo o dashboard **Kubernetes/Compute Resources/Namespace (Pods)**, que mostra detalhes de CPU e memória utilizados por todos os pods de todos os namespaces do nosso cluster EKS.

Ainda temos Dashboards que mostram detalhes do nosso cluster EKS, como por exemplo o dashboard **Kubernetes/Compute Resources/Namespace (Workloads)**, que mostra detalhes de CPU e memória utilizados por todos os deployments, statefulsets e daemonsets de todos os namespaces do nosso cluster EKS.

Também temos Dashboards que mostram detalhes do nosso cluster EKS, como por exemplo o dashboard **Kubernetes/Compute Resources/Node**, que mostra detalhes de CPU e memória utilizados por todos os nós do nosso cluster EKS.

Também temos Dashboards que mostram detalhes do nosso cluster EKS, como por exemplo o dashboard **Kubernetes/Compute Resources/Pod (Containers)**, que mostra detalhes de CPU e memória utilizados por todos os containers de todos os pods do nosso cluster EKS.