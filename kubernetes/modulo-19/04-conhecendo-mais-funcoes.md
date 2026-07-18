# Utilizando default, toYaml e toJson no Helm

Vamos comecer mais algumas funções do Helm, que são o default, toYaml e toJson, que nos ajudarão a deixar o nosso Chart ainda mais dinâmico e customizável.

Suponhamos que queremos garantir que sempre haja um valor padrão para o número de réplicas nos nossos deployments, mesmo que esse valor não tenha sido especificamente definido no values.yaml. Podemos modificar o nosso giropops-senhas-deployment.yaml para incluir a função default:

~~~
replicas: {{ .Values.giropopsSenhas.replicas | default 3 }}
~~~

Agora vamos adicionar a configuração necessária para a observabilidade da nossa aplicação "Giropops-Senhas", que inclui diversos parâmetros de configuração, e precisamos passá-la como uma string JSON para um ConfigMap. E o toJson irá nos salvar:

No `values.yaml`, adicionamos uma configuração complexa:

~~~yaml
observability:
  giropops-senhas:
    logging: true
    metrics:
      enabled: true
      path: "/metrics"
~~~

Agora vamos criar um ConfigMap que inclui essa configuração como uma string JSON:

~~~yaml
{{- range $component, $config := .Values.observability }}
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ $component }}-observability-config
data:
  app-config.json: | 
    
{{- end }}
~~~

Dessa forma, transformamos a configuração definida no values.yaml em uma string JSON formatada, que é injetada diretamente no ConfigMap. A função nindent 4 garante que iremos usar com 4 espaços de indentação a cada linha do conteúdo injetado.

~~~json
{
    "logging": true,
    "metrics": {
        "enabled": true,
        "path": "/metrics"
    }
}
~~~

E por fim, vamos adicionar o endereço de um banco de dados como uma configuração YAML, e precisamos passá-la como uma string YAML para um ConfigMap. E o toYaml é a função que irá garantir que a configuração seja injetada corretamente:

A configuração no values.yaml:

~~~yaml
databases:
  giropops-senhas:
    type: "MySQL"
      host: "mysql.svc.cluster.local"
      port: 3306
      name: "MyDB"
~~~

Com isso, já podemos criar um ConfigMap que inclui essa configuração como uma string YAML:

~~~yaml
{{- range $component, $config := .Values.databases }}
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ $component }}-db-config
data:
  app-config.yaml: |
{{- end }}
~~~

Dessa forma, transformamos a configuração definida no values.yaml em uma string YAML formatada, que é injetada diretamente no ConfigMap. A função nindent 2 garante que o conteúdo injetado esteja corretamente indentado, pois ela adiciona 2 espaços de indentação a cada linha do conteúdo injetado.

Para que possamos aplicar essas modificações, precisamos realizar o upgrade da nossa aplicação, para isso, execute o comando abaixo:

~~~sh
helm upgrade giropops-senhas ./
~~~

Agora já temos além dos deployments e services, também os ConfigMaps para a nossa aplicação.

Para ver os ConfigMaps, execute o comando abaixo:

~~~sh
kubectl get configmaps
~~~

Para ver os detalhes de cada ConfigMap, execute o comando abaixo:

~~~sh
kubectl get configmap <configmap-name> -o yaml
~~~