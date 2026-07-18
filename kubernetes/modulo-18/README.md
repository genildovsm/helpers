# RBAC

### O que é RBAC?

RBAC é um acrônimo para Role-Based Access Control, ou Controle de Acesso Baseado em Funções. É um método de controle de acesso que permite que um administrador defina permissões específicas para usuários e grupos de usuários. Isso significa que os administradores podem controlar quem tem acesso a quais recursos e o que eles podem fazer com esses recursos.

No Kubernetes é super importante você entender como funciona o RBAC, pois é através dele que você vai definir as permissões de acesso aos recursos do cluster, como por exemplo, quem pode criar um Pod, um Deployment, um Service, etc.

### Primeiro exemplo de RBAC

Vamos imaginar que precisamos dar acesso ao cluster a uma pessoa desenvolvedora da nossa empresa, mas não queremos que ela tenha acesso a todos os recursos do cluster, apenas aos recursos que ela precisa para desenvolver a sua aplicação.

Para isso, vamos criar um usuário chamado **developer** e vamos dar acesso a ele para criar e administrar os Pods no namespace **dev**.

Temos duas formas de fazer isso, a primeira e mais antiga é através da criação de um Token de acesso, e a que iremos abordar na sequência é através da criação de um certificado. O Token é mais utilizado para dar acesso a um ServiceAccount, que é um usuário que não é humano. Por exemplo, podemos ter um ServiceAccount para o Prometheus poder coletar métricas do cluster, ou um ServiceAccount para o Fluentd poder coletar os logs do cluster. E podemos ter um User para um usuário humano, como por exemplo, o usuário **developer** que iremos criar.

- [01 - Criando o nosso certificado](./01-criando-o-nosso-certificado.md)
- [02 - Api Resources, ApiGroups, Resources e verbos](./02-api-resources-apigroups-resources-e-verbs.md)
- [03 - Criando um rolebinding para o usuário](./03-criando-um-rolebinding-para-o-usuario.md)
- [04 - Acessando o cluster com o novo usuario](./04-acessando-o-cluster-com-o-novo-usuario.md)
- [05 - ClusterRole e ClusterRoleBinding](./05-cluster-role-e-cluster-role-binding.md)
- [06 - Utilizando tokens para Service Accounts](./06-criando-serviceaccount-utilizando-token.md)