# Service Monitors, Pod monitors e Alertas

### O que é o kube-prometheus?

O kube-prometheus é um conjunto de manifestos do Kubernetes que nos permite ter o Prometheus Operator, Grafana, AlertManager, Node Exporter, Kube-State-Metrics, Prometheus-Adapter instalados e configurados de forma tranquila e com alta disponibilidade. Além disso, ele nos permite ter uma visão completa do nosso cluster de Kubernetes. Ele nos permite monitorar todos os componentes do nosso cluster de Kubernetes, como por exemplo: kube-scheduler, kube-controller-manager, kubelet, kube-proxy, etc.

## Instalando o Kube-Prometheus

Instalando o Kube-Prometheus
Agora que já temos o nosso cluster EKS criado, vamos instalar o Kube-Prometheus. Para isso, basta executar o seguinte comando:

~~~sh
git clone https://github.com/prometheus-operator/kube-prometheus
cd kube-prometheus
kubectl create -f manifests/setup
~~~

Com o comando acima nós estamos clonando o repositório oficial do projeto, e aplicando os manifests necessários para a instalação do Kube-Prometheus. Após a execução do comando acima, você deverá ver uma mensagem parecida com a seguinte:
~~~
customresourcedefinition.apiextensions.k8s.io/alertmanagerconfigs.monitoring.coreos.com created
customresourcedefinition.apiextensions.k8s.io/alertmanagers.monitoring.coreos.com created
customresourcedefinition.apiextensions.k8s.io/podmonitors.monitoring.coreos.com created
customresourcedefinition.apiextensions.k8s.io/probes.monitoring.coreos.com created
customresourcedefinition.apiextensions.k8s.io/prometheuses.monitoring.coreos.com created
customresourcedefinition.apiextensions.k8s.io/prometheusrules.monitoring.coreos.com created
customresourcedefinition.apiextensions.k8s.io/servicemonitors.monitoring.coreos.com created
customresourcedefinition.apiextensions.k8s.io/thanosrulers.monitoring.coreos.com created
namespace/monitoring created
~~~

Basicamente o que fizemos foi a instalação de alguns CRDs (Custom Resource Definitions) que são como extensões do Kubernetes, e que são utilizados pelo Kube-Prometheus e com isso o Kubernetes irá reconhecer esses novos recursos, como por exemplo o `PrometheusRule` e o `ServiceMonitor que irei falar mais a frente.

O processo de instalação dos CRDs pode demorar alguns minutos, então vamos aguardar a instalação terminar. 😄

Para verificar se a instalação dos CRDs foi concluída, o comando abaixo deverá funcionar,se ainda não funcionar, aguarde alguns minutos e tente novamente.

~~~sh
kubectl get servicemonitors -A
~~~

Após a instalação dos CRDs, vamos instalar o `Prometheus` e o `Alertmanager`. Para isso, basta executar o seguinte comando:

~~~sh
kubectl apply -f manifests/
~~~

Com o comando acima nós estamos aplicando os manifests necessários para a instalação do Prometheus e do Alertmanager. Após a execução do comando acima, você deverá ver uma mensagem parecida com a seguinte:

~~~sh
alertmanager.monitoring.coreos.com/main created
networkpolicy.networking.k8s.io/alertmanager-main created
poddisruptionbudget.policy/alertmanager-main created
prometheusrule.monitoring.coreos.com/alertmanager-main-rules created
secret/alertmanager-main created
...
~~~

Com isso fizemos a instalação da Stack do nosso Kube-Prometheus, que é composta pelo Prometheus, pelo Alertmanager, Blackbox Exporter e Grafana. 😄
Perceba que ele já está configurando um monte de outras coisas como os ConfigMaps, Secrets, ServiceAccounts, etc.

Para verificar se a instalação foi concluída, basta executar o seguinte comando:

~~~sh
kubectl get pods -n monitoring
~~~

O resultado esperado é o seguinte:

~~~sh
NAME                                  READY   STATUS    RESTARTS   AGE
alertmanager-main-0                   2/2     Running   0          57s
alertmanager-main-1                   2/2     Running   0          57s
alertmanager-main-2                   2/2     Running   0          57s
blackbox-exporter-cbb9c96b-t8z68      3/3     Running   0          94s
grafana-589787799d-pxsts              1/1     Running   0          80s
kube-state-metrics-557d857c5d-kt8dd   3/3     Running   0          78s
node-exporter-2n6sz                   2/2     Running   0          74s
node-exporter-mwq6b                   2/2     Running   0          74s
prometheus-adapter-758645c65b-54c7g   1/1     Running   0          64s
prometheus-adapter-758645c65b-cmjrv   1/1     Running   0          64s
prometheus-k8s-0                      2/2     Running   0          57s
prometheus-k8s-1                      2/2     Running   0          57s
prometheus-operator-c766b9756-vndp9   2/2     Running   0          63s
~~~

Pronto, já temos o Prometheus, Alertmanager, Blackbox Exporter, Node Exporter e Grafana instalados. 😄
Nesse meu cluster, eu estou com dois nodes, por isso temos dois pods do Node Exporter e dois pods do Prometheus chamados de `prometheus-k8s-0 e `prometheus-k8s-1`.

## Acessando o Grafana

Agora que já temos o nosso Kube-Prometheus instalado, vamos acessar o nosso Grafana e verificar se está tudo funcionando corretamente. Para isso, vamos utilizar o `kubectl port-forward` para acessar o Grafana localmente. Para isso, basta executar o seguinte comando:

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

Também temos Dashboards que mostram detalhes do nosso cluster EKS, como por exemplo o dashboard **Kubernetes/Compute Resources/Pod (Containers),** que mostra detalhes de CPU e memória utilizados por todos os containers de todos os pods do nosso cluster EKS.

## Os Service Monitors

Um dos principais recursos que o **Kube-Prometheus** utiliza é o ServiceMonitor. O **ServiceMonitor** é um recurso do **Prometheus Operator** que permite que você configure o Prometheus para monitorar um serviço. Para isso, você precisa criar um **ServiceMonitor** para cada serviço que você deseja monitorar.

O Kube-Prometheus já vem com vários ServiceMonitors configurados, como por exemplo o ServiceMonitor do API Server, do Node Exporter, do Blackbox Exporter, etc.

~~~sh
kubectl get servicemonitors -n monitoring
~~~

Para ver o conteúdo de um ServiceMonitor, basta executar o seguinte comando:

~~~sh
kubectl get servicemonitor prometheus-k8s -n monitoring -o yaml
~~~

Nesse caso estamos pegando o ServiceMonitor do Prometheus, mas você pode pegar o ServiceMonitor de qualquer outro serviço.

~~~yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  annotations:
  labels:
    app.kubernetes.io/component: prometheus
    app.kubernetes.io/instance: k8s
    app.kubernetes.io/name: prometheus
    app.kubernetes.io/part-of: kube-prometheus
    app.kubernetes.io/version: 2.41.0
  name: prometheus-k8s
  namespace: monitoring
spec:
  endpoints:
  - interval: 30s
    port: web
  - interval: 30s
    port: reloader-web
  selector:
    matchLabels:
      app.kubernetes.io/component: prometheus
      app.kubernetes.io/instance: k8s
      app.kubernetes.io/name: prometheus
      app.kubernetes.io/part-of: kube-prometheus
~~~

Pronto, eu tirei algumas informações que não são importantes para a criação do ServiceMonitor, elas apenas trazer as informações do service monitor que foi criado e que pegamos a saída.

- **apiVersion:** Versão da API do Kubernetes que estamos utilizando.
- **kind:** Tipo de objeto que estamos criando.
- **metadata:** Informações sobre o objeto que estamos criando.
- **metadata.annotations:** Anotações que podemos adicionar ao nosso objeto.
- **metadata.labels:** Labels que podemos adicionar ao nosso objeto.
- **metadata.name:** Nome do nosso objeto.
- **metadata.namespace:** Namespace onde o nosso objeto será criado.
- **spec:** Especificações do nosso objeto.
- **spec.endpoints:** Endpoints que o nosso ServiceMonitor irá monitorar.
- **spec.endpoints.interval:** Intervalo de tempo que o Prometheus irá fazer a coleta de métricas.
- **spec.endpoints.port:** Porta que o Prometheus irá utilizar para coletar as métricas.
- **spec.selector:** Selector que o ServiceMonitor irá utilizar para encontrar os serviços que ele irá monitorar.

Com isso, sabemos que o ServiceMonitor do Prometheus irá monitorar os serviços que possuem as labels **app.kubernetes.io/component: prometheus, app.kubernetes.io/instance: k8s, app.kubernetes.io/name: prometheus e app.kubernetes.io/part-of: kube-prometheus,** e que ele irá monitorar as portas web e reloader-web com um intervalo de 30 segundos.

## Criando um Service Monitor

Bem, chegou a hora de criarmos o nosso primeiro ServiceMonitor, mas antes precisamos ter uma aplicação para monitorarmos. Para isso, vamos criar uma aplicação com Nginx e utilizar o exporter do Nginx para monitorarmos o nosso serviço.
Vamos criar ainda um outro pod para que possamos criar um teste de carga para a nossa aplicação, realizando assim uma carga de até 1000 requisições por segundo.

Antes de mais nada, precisamos criar um ConfigMap onde terá a configuração que queremos para o nosso Nginx. Nada demais, somente a criação do nosso ConfigMap com o arquivo de configuração do Nginx, onde vamos definir a rota **/nginx_status** para expor as métricas do Nginx, além de expor a rota **/metrics** para expor as métricas do Nginx Exporter.

Vamos criar o nosso ConfigMap com o seguinte arquivo YAML:

~~~yaml
apiVersion: v1 # versão da API
kind: ConfigMap # tipo de recurso, no caso, um ConfigMap
metadata: # metadados do recurso
  name: nginx-config # nome do recurso
data: # dados do recurso
  nginx.conf: | # inicio da definição do arquivo de configuração do Nginx
    server {
      listen 80;
      location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
      }
      location /metrics {
        stub_status on;
        access_log off;
      }
    }
~~~

Agora vamos entender o que está acontecendo no nosso arquivo YAML.

- **apiVersion:** Versão da API do Kubernetes que estamos utilizando.
- **kind:** Tipo de objeto que estamos criando.
- **metadata:** Informações sobre o objeto que estamos criando.
- **metadata.name:** Nome do nosso objeto.
- **data:** Dados que serão utilizados no nosso ConfigMap.
- **data.nginx.conf:** A configuração do Nginx.

Vamos criar o nosso ConfigMap com o seguinte comando:

~~~sh
kubectl apply -f nginx-config.yaml
~~~

Após o nosso ConfigMap ser criado, vamos verificar se o nosso ConfigMap está rodando:

~~~sh
kubectl get configmaps
~~~

Para criar a nossa aplicação, vamos utilizar o seguinte arquivo YAML:

~~~yaml
apiVersion: apps/v1 # versão da API
kind: Deployment # tipo de recurso, no caso, um Deployment
metadata: # metadados do recurso 
  name: nginx-server # nome do recurso
spec: # especificação do recurso
  selector: # seletor para identificar os pods que serão gerenciados pelo deployment
    matchLabels: # labels que identificam os pods que serão gerenciados pelo deployment
      app: nginx # label que identifica o app que será gerenciado pelo deployment
  replicas: 3 # quantidade de réplicas do deployment
  template: # template do deployment
    metadata: # metadados do template
      labels: # labels do template
        app: nginx # label que identifica o app
      annotations: # annotations do template
        prometheus.io/scrape: 'true' # habilita o scraping do Prometheus
        prometheus.io/port: '9113' # porta do target
    spec: # especificação do template
      containers: # containers do template 
        - name: nginx # nome do container
          image: nginx # imagem do container do Nginx
          ports: # portas do container
            - containerPort: 80 # porta do container
              name: http # nome da porta
          volumeMounts: # volumes que serão montados no container
            - name: nginx-config # nome do volume
              mountPath: /etc/nginx/conf.d/default.conf # caminho de montagem do volume
              subPath: nginx.conf # subpath do volume
        - name: nginx-exporter # nome do container que será o exporter
          image: 'nginx/nginx-prometheus-exporter:0.11.0' # imagem do container do exporter
          args: # argumentos do container
            - '-nginx.scrape-uri=http://localhost/metrics' # argumento para definir a URI de scraping
          resources: # recursos do container
            limits: # limites de recursos
              memory: 128Mi # limite de memória
              cpu: 0.3 # limite de CPU
          ports: # portas do container
            - containerPort: 9113 # porta do container que será exposta
              name: metrics # nome da porta
      volumes: # volumes do template
        - configMap: # configmap do volume, nós iremos criar esse volume através de um configmap
            defaultMode: 420 # modo padrão do volume
            name: nginx-config # nome do configmap
          name: nginx-config # nome do volume
~~~

**Agora vamos entender o que está acontecendo no nosso arquivo YAML**

- apiVersion: Versão da API do Kubernetes que estamos utilizando.
- kind: Tipo de objeto que estamos criando.
- metadata: Informações sobre o objeto que estamos criando.
- metadata.name: Nome do nosso objeto.
- spec: Especificações do nosso objeto.
- spec.selector: Selector que o ServiceMonitor irá utilizar para encontrar os serviços que ele irá monitorar.
- spec.selector.matchLabels: Labels que o ServiceMonitor irá utilizar para encontrar os serviços que ele irá monitorar.
- spec.selector.matchLabels.app: Label que o ServiceMonitor irá utilizar para encontrar os serviços que ele irá monitorar.
- spec.replicas: Quantidade de réplicas que o nosso Deployment irá criar.
- spec.template: Template que o nosso Deployment irá utilizar para criar os pods.
- spec.template.metadata: Informações sobre o nosso pod.
- spec.template.metadata.labels: Labels que serão adicionadas ao nosso pod.
- spec.template.metadata.labels.app: Label que será adicionada ao nosso pod.
- spec.template.metadata.annotations: Annotations que serão adicionadas ao nosso pod.
- spec.template.metadata.annotations.prometheus.io/scrape: Annotation que será adicionada ao nosso pod.
- spec.template.metadata.annotations.prometheus.io/port: Annotation que será adicionada ao nosso pod.
- spec.template.spec: Especificações do nosso pod.
- spec.template.spec.containers: Containers que serão criados no nosso pod.
- spec.template.spec.containers.name: Nome do nosso container.
- spec.template.spec.containers.image: Imagem que será utilizada no nosso container.
- spec.template.spec.containers.ports: Portas que serão expostas no nosso container.
- spec.template.spec.containers.ports.containerPort: Porta que será exposta no nosso container.
- spec.template.spec.containers.volumeMounts: Volumes que serão montados no nosso container.
- spec.template.spec.containers.volumeMounts.name: Nome do volume que será montado no nosso container.
- spec.template.spec.containers.volumeMounts.mountPath: Caminho que o volume será montado no nosso container.
- spec.template.spec.containers.volumeMounts.subPath.nginx.conf: Subpath que o volume será montado no nosso container.
- spec.template.spec.volumes: Volumes que serão criados no nosso pod.
- spec.template.spec.volumes.configMap: ConfigMap que será utilizado no nosso volume.
- spec.template.spec.volumes.configMap.defaultMode: Modo de permissão que o volume será criado.
- spec.template.spec.volumes.configMap.name: Nome do ConfigMap que será utilizado no nosso volume.
- spec.template.spec.volumes.name: Nome do nosso volume.

Agora que já sabemos o que está acontecendo no nosso arquivo YAML, vamos criar o nosso Deployment com o seguinte comando:

~~~sh
kubectl apply -f nginx-deployment.yaml
~~~

Após o nosso Deployment ser criado, vamos verificar se o nosso pod está rodando:

~~~sh
kubectl get pods
~~~

Podemos ver o deployment que acabamos de criar através do comando:

~~~sh
kubectl get deployments
~~~

Agora o que precisamos é criar um Service para expor o nosso deployment. Vamos criar o nosso Service com o seguinte arquivo YAML:

~~~yaml
apiVersion: v1 # versão da API
kind: Service # tipo de recurso, no caso, um Service
metadata: # metadados do recurso
  name: nginx-svc # nome do recurso
  labels: # labels do recurso
    app: nginx # label para identificar o svc
spec: # especificação do recurso
  ports: # definição da porta do svc 
  - port: 9113 # porta do svc
    name: metrics # nome da porta
  selector: # seletor para identificar os pods/deployment que esse svc irá expor
    app: nginx # label que identifica o pod/deployment que será exposto
~~~

**Agora vamos entender o que está acontecendo no nosso arquivo YAML**

- apiVersion: Versão da API do Kubernetes que estamos utilizando.
- kind: Tipo de objeto que estamos criando.
- metadata: Informações sobre o objeto que estamos criando.
- metadata.name: Nome do nosso objeto.
- spec: Especificações do nosso objeto.
- spec.selector: Selector que o Service irá utilizar para encontrar os pods que ele irá expor.
- spec.selector.app: Label que o Service irá utilizar para encontrar os pods que ele irá expor.
- spec.ports: Configurações das portas que serão expostas no nosso Service.
- spec.ports.protocol: Protocolo que será utilizado na porta que será exposta.
- spec.ports.port: Porta que será exposta no nosso Service.
- spec.ports.name: Nome da porta que será exposta no nosso Service.

Vamos criar o Service com o seguinte comando:

~~~sh
kubectl apply -f nginx-service.yaml
~~~

Após o nosso Service ser criado, vamos verificar se o nosso Service está rodando:

~~~sh
kubectl get services
~~~

Agora vamos verificar se o nosso Nginx está rodando e se as métricas estão sendo expostas. 

Vamos verificar se o nosso Nginx está rodando com o seguinte comando:

~~~sh
curl http://<EXTERNAL-IP-DO-SERVICE>:80
~~~

Vamos verificar se as métricas do Nginx estão sendo expostas com o seguinte comando:

~~~sh
curl http://<EXTERNAL-IP-DO-SERVICE>:80/nginx_status
~~~

Vamos verificar se as métricas do Nginx Exporter estão sendo expostas com o seguinte comando:

~~~sh
curl http://<EXTERNAL-IP-DO-SERVICE>:80/metrics
~~~

Ótimo, agora você já sabe como que faz para criar um Service no Kubernetes e expor as métricas do Nginx e do Nginx Exporter.