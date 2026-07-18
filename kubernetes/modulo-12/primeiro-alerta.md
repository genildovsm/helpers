# Criando nosso primeiro alerta
Agora que já temos o nosso Kube-Prometheus instalado, vamos configurar o Prometheus para monitorar o nosso cluster EKS. Para isso, vamos utilizar o kubectl port-forward para acessar o Prometheus localmente. Para isso, basta executar o seguinte comando:

~~~sh
kubectl port-forward -n monitoring svc/prometheus-k8s 39090:9090
~~~

Se você quiser acessar o Alertmanager, basta executar o seguinte comando:

~~~sh
kubectl port-forward -n monitoring svc/alertmanager-main 39093:9093
~~~

Pronto, agora você já sabe como que faz para acessar o Prometheus, AlertManager e o Grafana localmente.

Lembrando que você pode acessar o Prometheus e o AlertManager através do seu navegador, basta acessar as seguintes URLs:

- Prometheus: http://localhost:39090
- AlertManager: http://localhost:39093

Evidentemente, você pode expor esses serviços para a internet ou para um VPC privado, mas isso é assunto para você discutir com seu time.

Antes sair definindo um novo alerta, precisamos entender como faze-lo, uma vez que nós não temos mais o arquivo de alertas, igual tínhamos quando instalamos o Prometheus em nosso servidor Linux.

Agora, precisamos entender que boa parte da configuração do Prometheus está dentro de configmaps, que são recursos do Kubernetes que armazenam dados em formato de chave e valor e são muito utilizados para armazenar configurações de aplicações.

Para listar os configmaps do nosso cluster, basta executar o seguinte comando:
~~~sh
kubectl get configmaps -n monitoring
~~~

O resultado do comando acima deverá ser parecido com o seguinte:

~~~sh
NAME                                                  DATA   AGE
adapter-config                                        1      7m20s
blackbox-exporter-configuration                       1      7m49s
grafana-dashboard-alertmanager-overview               1      7m46s
grafana-dashboard-apiserver                           1      7m46s
grafana-dashboard-cluster-total                       1      7m46s
grafana-dashboard-controller-manager                  1      7m45s
grafana-dashboard-grafana-overview                    1      7m44s
grafana-dashboard-k8s-resources-cluster               1      7m44s
grafana-dashboard-k8s-resources-namespace             1      7m44s
grafana-dashboard-k8s-resources-node                  1      7m43s
grafana-dashboard-k8s-resources-pod                   1      7m42s
grafana-dashboard-k8s-resources-workload              1      7m42s
grafana-dashboard-k8s-resources-workloads-namespace   1      7m41s
grafana-dashboard-kubelet                             1      7m41s
grafana-dashboard-namespace-by-pod                    1      7m41s
grafana-dashboard-namespace-by-workload               1      7m40s
grafana-dashboard-node-cluster-rsrc-use               1      7m40s
grafana-dashboard-node-rsrc-use                       1      7m39s
grafana-dashboard-nodes                               1      7m39s
grafana-dashboard-nodes-darwin                        1      7m39s
grafana-dashboard-persistentvolumesusage              1      7m38s
grafana-dashboard-pod-total                           1      7m38s
grafana-dashboard-prometheus                          1      7m37s
grafana-dashboard-prometheus-remote-write             1      7m37s
grafana-dashboard-proxy                               1      7m37s
grafana-dashboard-scheduler                           1      7m36s
grafana-dashboard-workload-total                      1      7m36s
grafana-dashboards                                    1      7m35s
kube-root-ca.crt                                      1      11m
prometheus-k8s-rulefiles-0                            8      7m10s
~~~

Como você pode ver, temos diversos configmaps que contém configurações do Prometheus, AlertManager e do Grafana. Vamos focar no configmap prometheus-k8s-rulefiles-0, que é o configmap que contém os alertas do Prometheus.

Para visualizar o conteúdo do configmap, basta executar o seguinte comando:

~~~sh
kubectl get configmap prometheus-k8s-rulefiles-0 -n monitoring -o yaml
~~~

Eu não vou colar a saída inteira aqui porque ela é enorme, mas vou colar um pedaço com um exemplo de alerta:

~~~yaml
- alert: KubeMemoryOvercommit
    annotations:
        description: Cluster has overcommitted memory resource requests for Pods by
        {{ $value | humanize }} bytes and cannot tolerate node failure.
        runbook_url: https://runbooks.prometheus-operator.dev/runbooks/kubernetes/kubememoryovercommit
        summary: Cluster has overcommitted memory resource requests.
    expr: |
        sum(namespace_memory:kube_pod_container_resource_requests:sum{}) - (sum(kube_node_status_allocatable{resource="memory"}) - max(kube_node_status_allocatable{resource="memory"})) > 0
        and
        (sum(kube_node_status_allocatable{resource="memory"}) - max(kube_node_status_allocatable{resource="memory"})) > 0
    for: 10m
    labels:
        severity: warning
~~~

Como você pode ver, o alerta acima é chamado de KubeMemoryOvercommit e ele é disparado quando o cluster tem mais memória alocada para os pods do que a memória disponível nos nós. A sua definição é a mesma que usamos quando criamos o arquivo de alertas no nosso servidor Linux.

### Criando um novo alerta

Muito bom, já sabemos que temos algumas regras já definidas, e que elas estão dentro de um configmap. Agora, vamos criar um novo alerta para monitorar o nosso Nginx.

Mas antes, precisamos entender o que é um recurso chamado PrometheusRule.

### O que é um PrometheusRule?

O PrometheusRule é um recurso do Kubernetes que foi instalado no momento que realizamos a instalação dos CRDs do kube-prometheus. O PrometheusRule permite que você defina alertas para o Prometheus. Ele é muito parecido com o arquivo de alertas que criamos no nosso servidor Linux, porém nesse momento vamos fazer a mesma definição de alerta, mas usando o PrometheusRule.

**Criando um PrometheusRule** 

Vamos criar um arquivo chamado `nginx-prometheus-rule.yaml` e vamos colocar o seguinte conteúdo:

~~~yaml
apiVersion: monitoring.coreos.com/v1 # Versão da api do PrometheusRule
kind: PrometheusRule # Tipo do recurso
metadata: # Metadados do recurso (nome, namespace, labels)
  name: nginx-prometheus-rule
  namespace: monitoring
  labels: # Labels do recurso
    prometheus: k8s # Label que indica que o PrometheusRule será utilizado pelo Prometheus do Kubernetes
    role: alert-rules # Label que indica que o PrometheusRule contém regras de alerta
    app.kubernetes.io/name: kube-prometheus # Label que indica que o PrometheusRule faz parte do kube-prometheus
    app.kubernetes.io/part-of: kube-prometheus # Label que indica que o PrometheusRule faz parte do kube-prometheus
spec: # Especificação do recurso
  groups: # Lista de grupos de regras
  - name: nginx-prometheus-rule # Nome do grupo de regras
    rules: # Lista de regras
    - alert: NginxDown # Nome do alerta
      expr: up{job="nginx"} == 0 # Expressão que será utilizada para disparar o alerta
      for: 1m # Tempo que a expressão deve ser verdadeira para que o alerta seja disparado
      labels: # Labels do alerta
        severity: critical # Label que indica a severidade do alerta
      annotations: # Anotações do alerta
        summary: "Nginx is down" # Título do alerta
        description: "Nginx is down for more than 1 minute. Pod name: {{ $labels.pod }}" # Descrição do alerta
~~~

Agora, vamos criar o PrometheusRule no nosso cluster:

~~~sh
kubectl apply -f nginx-prometheus-rule.yaml
~~~

Agora, vamos verificar se o PrometheusRule foi criado com sucesso:

~~~sh
kubectl get prometheusrules -n monitoring
~~~

A saída deve ser parecida com essa:

~~~sh
NAME                              AGE
alertmanager-main-rules           92m
grafana-rules                     92m
kube-prometheus-rules             92m
kube-state-metrics-rules          92m
kubernetes-monitoring-rules       92m
nginx-prometheus-rule             20s
node-exporter-rules               91m
prometheus-k8s-prometheus-rules   91m
prometheus-operator-rules         91m
~~~

Agora nós já temos um novo alerta configurado em nosso Prometheus. Lembrando que temos a integração com o AlertManager, então, quando o alerta for disparado, ele será enviado para o AlertManager e o AlertManager vai enviar uma notificação, por exemplo, para o nosso Slack ou e-mail.

Você pode acessar o nosso alerta tanto no Prometheus quanto no AlertManager.

Vamos imaginar que você precisa criar um novo alerta para monitorar a quantidade de requisições simultâneas que o seu Nginx está recebendo. Para isso, você precisa criar uma nova regra no PrometheusRule. Podemos utilizar o mesmo arquivo `nginx-prometheus-rule.yaml` e adicionar a nova regra no final do arquivo:

~~~yaml
apiVersion: monitoring.coreos.com/v1 # Versão da api do PrometheusRule
kind: PrometheusRule # Tipo do recurso
metadata: # Metadados do recurso (nome, namespace, labels)
  name: nginx-prometheus-rule
  namespace: monitoring
  labels: # Labels do recurso
    prometheus: k8s # Label que indica que o PrometheusRule será utilizado pelo Prometheus do Kubernetes
    role: alert-rules # Label que indica que o PrometheusRule contém regras de alerta
    app.kubernetes.io/name: kube-prometheus # Label que indica que o PrometheusRule faz parte do kube-prometheus
    app.kubernetes.io/part-of: kube-prometheus # Label que indica que o PrometheusRule faz parte do kube-prometheus
spec: # Especificação do recurso
  groups: # Lista de grupos de regras
  - name: nginx-prometheus-rule # Nome do grupo de regras
    rules: # Lista de regras
    - alert: NginxDown # Nome do alerta
      expr: up{job="nginx"} == 0 # Expressão que será utilizada para disparar o alerta
      for: 1m # Tempo que a expressão deve ser verdadeira para que o alerta seja disparado
      labels: # Labels do alerta
        severity: critical # Label que indica a severidade do alerta
      annotations: # Anotações do alerta
        summary: "Nginx is down" # Título do alerta
        description: "Nginx is down for more than 1 minute. Pod name: {{ $labels.pod }}" # Descrição do alerta

    - alert: NginxHighRequestRate # Nome do alerta
        expr: rate(nginx_http_requests_total{job="nginx"}[5m]) > 10 # Expressão que será utilizada para disparar o alerta
        for: 1m # Tempo que a expressão deve ser verdadeira para que o alerta seja disparado
        labels: # Labels do alerta
            severity: warning # Label que indica a severidade do alerta
        annotations: # Anotações do alerta
            summary: "Nginx is receiving high request rate" # Título do alerta
            description: "Nginx is receiving high request rate for more than 1 minute. Pod name: {{ $labels.pod }}" # Descrição do alerta
~~~

Pronto, adicionamos uma nova definição de alerta em nosso PrometheusRule. Agora vamos atualizar o nosso PrometheusRule:

~~~sh
kubectl apply -f nginx-prometheus-rule.yaml
~~~

Agora, vamos verificar se o PrometheusRule foi atualizado com sucesso:

~~~sh
kubectl get prometheusrules -n monitoring nginx-prometheus-rule -o yaml
~~~

A saída deve ser parecida com essa:

~~~yaml
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  annotations:
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"monitoring.coreos.com/v1","kind":"PrometheusRule","metadata":{"annotations":{},"labels":{"app.kubernetes.io/name":"kube-prometheus","app.kubernetes.io/part-of":"kube-prometheus","prometheus":"k8s","role":"alert-rules"},"name":"nginx-prometheus-rule","namespace":"monitoring"},"spec":{"groups":[{"name":"nginx-prometheus-rule","rules":[{"alert":"NginxDown","annotations":{"description":"Nginx is down for more than 1 minute. Pod name: {{ $labels.pod }}","summary":"Nginx is down"},"expr":"up{job=\"nginx\"} == 0","for":"1m","labels":{"severity":"critical"}},{"alert":"NginxHighRequestRate","annotations":{"description":"Nginx is receiving high request rate for more than 1 minute. Pod name: {{ $labels.pod }}","summary":"Nginx is receiving high request rate"},"expr":"rate(nginx_http_requests_total{job=\"nginx\"}[5m]) \u003e 10","for":"1m","labels":{"severity":"warning"}}]}]}}
  creationTimestamp: "2023-03-01T14:14:00Z"
  generation: 2
  labels:
    app.kubernetes.io/name: kube-prometheus
    app.kubernetes.io/part-of: kube-prometheus
    prometheus: k8s
    role: alert-rules
  name: nginx-prometheus-rule
  namespace: monitoring
  resourceVersion: "24923"
  uid: c0a6914d-9a54-4083-bdf8-ebfb5c19077d
spec:
  groups:
  - name: nginx-prometheus-rule
    rules:
    - alert: NginxDown
      annotations:
        description: 'Nginx is down for more than 1 minute. Pod name: {{ $labels.pod
          }}'
        summary: Nginx is down
      expr: up{job="nginx"} == 0
      for: 1m
      labels:
        severity: critical
    - alert: NginxHighRequestRate
      annotations:
        description: 'Nginx is receiving high request rate for more than 1 minute.
          Pod name: {{ $labels.pod }}'
        summary: Nginx is receiving high request rate
      expr: rate(nginx_http_requests_total{job="nginx"}[5m]) > 10
      for: 1m
      labels:
        severity: warning
~~~

Pronto, o alerta foi criado com sucesso e você pode conferir no Prometheus ou no AlertManager.

Com o novo alerta, caso o Nginx esteja recebendo mais de 10 requisições por minuto, o alerta será disparado e você receberá uma notificação no Slack ou e-mail, claro, dependendo da configuração que você fez no AlertManager.

Acho que já podemos chamar o dia de hoje de sucesso absoluto, pois entendemos como funciona para criar um novo target para o Prometheus, bem como criar um novo alerta para o AlertManager/Prometheus.

Agora você precisa dar asas para a sua imaginação e sair criando tudo que é exemplo de de alerta que você bem entender, e claro, coloque mais serviços no seu cluster Kubernetes para que você possa monitorar tudo que é possível através do ServiceMonitor e PrometheusRule do Prometheus Operator, e claro, não esqueça de compartilhar com a gente o que você criou.