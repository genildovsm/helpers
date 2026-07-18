# PodMonitors

E quando o nosso workload não é um Service? E quando o nosso workload é um Pod? Como que faz para monitorar o Pod?
Tem situações que não temos um service na frente de nossos pods, por exemplo, quando temos CronJobs, Jobs, DaemonSets, etc. Eu já vi situações onde o pessoal estavam utilizando o PodMonitor para monitorar pods não HTTP, por exemplo, pods que expõem métricas do RabbitMQ, do Redis, Kafka, etc.

### Criando um PodMonitor
Para criar um PodMonitor, quase não teremos muitas mudanças do que aprendemos para criar um ServiceMonitor. Vamos criar o nosso PodMonitor com o seguinte arquivo YAML chamado **nginx-pod-monitor.yaml**:

~~~yaml
apiVersion: monitoring.coreos.com/v1 # versão da API
kind: PodMonitor # tipo de recurso, no caso, um PodMonitor do Prometheus Operator
metadata: # metadados do recurso
  name: nginx-podmonitor # nome do recurso
  labels: # labels do recurso
    app: nginx # label que identifica o app
spec:
  namespaceSelector: # seletor de namespaces
    matchNames: # namespaces que serão monitorados
      - default # namespace que será monitorado
  selector: # seletor para identificar os pods que serão monitorados
    matchLabels: # labels que identificam os pods que serão monitorados
      app: nginx # label que identifica o app que será monitorado
  podMetricsEndpoints: # endpoints que serão monitorados
    - interval: 10s # intervalo de tempo entre as requisições
      path: /metrics # caminho para a requisição
      targetPort: 9113 # porta do target
~~~

Veja que usamos quase que as mesmas opções do ServiceMonitor, a única diferença é que usamos o **podMetricsEndpoints** para definir os endpoints que serão monitorados.
Outra novidade para nós é o **namespaceSelector**, que é utilizado para selecionar os namespaces que serão monitorados. No nosso caso, estamos monitorando o namespace **default**, onde estará em execução o nosso Pod do Nginx.

Antes de deployar o nosso PodMonitor, vamos criar o nosso Pod do Nginx com o seguinte arquivo YAML chamado **nginx-pod.yaml**:

~~~yaml
apiVersion: v1 # versão da API
kind: Pod # tipo de recurso, no caso, um Pod
metadata: # metadados do recurso
  name: nginx-pod # nome do recurso
  labels: # labels do recurso
    app: nginx # label que identifica o app
spec: # especificações do recursos
  containers: # containers do template 
    - name: nginx-container # nome do container
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

Pronto, com o nosso Pod criado, vamos criar o nosso PodMonitor utilizando o arquivo YAML chamado nginx-pod-monitor.yaml, que criamos anteriormente:

~~~sh
kubectl apply -f nginx-pod-monitor.yaml
~~~

Vamos verificar os PodMonitors que estão criados em nosso cluster:

~~~sh
kubectl get podmonitors
~~~

Caso você queira ver os PodMonitors em detalhes, basta executar o seguinte comando:

~~~sh
kubectl describe podmonitors nginx-podmonitor
~~~

E claro, você pode fazer o mesmo com o ServiceMonitor, basta executar o seguinte comando:

~~~sh
kubectl describe servicemonitors nginx-servicemonitor
~~~

Vamos ver a saida do describe para o nosso PodMonitor:

~~~yaml
Name:         nginx-podmonitor
Namespace:    default
Labels:       app=nginx
Annotations:  <none>
API Version:  monitoring.coreos.com/v1
Kind:         PodMonitor
Metadata:
  Creation Timestamp:  2023-03-01T17:17:13Z
  Generation:          1
  Managed Fields:
    API Version:  monitoring.coreos.com/v1
    Fields Type:  FieldsV1
    fieldsV1:
      f:metadata:
        f:annotations:
          .:
          f:kubectl.kubernetes.io/last-applied-configuration:
        f:labels:
          .:
          f:app:
      f:spec:
        .:
        f:namespaceSelector:
          .:
          f:matchNames:
        f:podMetricsEndpoints:
        f:selector:
    Manager:         kubectl-client-side-apply
    Operation:       Update
    Time:            2023-03-01T17:17:13Z
  Resource Version:  9473
  UID:               8c1bb91c-7285-4184-90e7-dcffcb143b92
Spec:
  Namespace Selector:
    Match Names:
      default
  Pod Metrics Endpoints:
    Interval:  10s
    Path:      /metrics
    Port:      9113
  Selector:
    Match Labels:
      App:  nginx
Events:     <none>
~~~

Como podemos ver, o nosso PodMonitor foi criado com sucesso. 😄

Agora vamos ver se ele está aparecendo como um target no Prometheus. Para isso, vamos acessar o Prometheus localmente através do `kubectl port-forward`:

~~~sh
kubectl port-forward -n monitoring svc/prometheus-k8s 39090:9090
~~~

Pronto, corre lá conferir o seu mais novo target e as métricas que estão sendo coletadas.

Uma coisa que vale a pena lembrar, é que você pode acessar o container com o kubectl exec e verificar se o seu exporter está funcionando corretamente ou somente para conferir quais são as métricas que ele está expondo para o Prometheus. Para isso, basta executar o seguinte comando:

~~~sh
kubectl exec -it nginx-pod -c nginx-exporter -- bash
~~~

Agora vamos utilizar o curl para verificar se o nosso exporter está funcionando corretamente:

~~~sh
curl localhost:9113/metrics
~~~

Se tudo está funcionando corretamente, você deve ver uma saída parecida com a seguinte:

~~~sh
# HELP nginx_connections_accepted Accepted client connections
# TYPE nginx_connections_accepted counter
nginx_connections_accepted 1
# HELP nginx_connections_active Active client connections
# TYPE nginx_connections_active gauge
nginx_connections_active 1
# HELP nginx_connections_handled Handled client connections
# TYPE nginx_connections_handled counter
nginx_connections_handled 1
# HELP nginx_connections_reading Connections where NGINX is reading the request header
# TYPE nginx_connections_reading gauge
nginx_connections_reading 0
# HELP nginx_connections_waiting Idle client connections
# TYPE nginx_connections_waiting gauge
nginx_connections_waiting 0
# HELP nginx_connections_writing Connections where NGINX is writing the response back to the client
# TYPE nginx_connections_writing gauge
nginx_connections_writing 1
# HELP nginx_http_requests_total Total http requests
# TYPE nginx_http_requests_total counter
nginx_http_requests_total 61
# HELP nginx_up Status of the last metric scrape
# TYPE nginx_up gauge
nginx_up 1
# HELP nginxexporter_build_info Exporter build information
# TYPE nginxexporter_build_info gauge
nginxexporter_build_info{arch="linux/amd64",commit="e4a6810d4f0b776f7fde37fea1d84e4c7284b72a",date="2022-09-07T21:09:51Z",dirty="false",go="go1.19",version="0.11.0"} 1
~~~

Lembrando que você pode consultar todas essas métricas lá no seu Prometheus. 
