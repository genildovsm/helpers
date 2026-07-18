### Excluindo um StatefulSet

Para excluir um StatefulSet precisamos utilizar o comando:

~~~sh
kubectl delete statefulset nginx
~~~

Ou ainda podemos excluir o StatefulSet utilizando o comando:

~~~sh
kubectl delete -f nginx-statefulset.yaml
~~~

### Excluindo um Headless Service

Para excluir um Headless Service precisamos utilizar o comando:

~~~sh
kubectl delete service nginx
~~~

Ou ainda podemos excluir o Headless Service utilizando o comando:

~~~sh
kubectl delete -f nginx-headless-service.yaml
~~~

### Excluindo um PVC

Para excluir um Volume precisamos utilizar o comando:

~~~sh
kubectl delete pvc www-0
~~~