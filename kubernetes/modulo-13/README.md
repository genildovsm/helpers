# Reduzindo vulnerabilidades com Wolfi

Usando "Keyless Signing" (Sigstore - Recomendado)
Se você não quiser gerenciar chaves públicas manualmente, o Cosign oferece o modo Keyless (sem chave). 
Nesse modo, você assina sem usar cosign.key.
O Sigstore utiliza OIDC (identidade baseada no GitHub/Google/Microsoft) e publica metadados no Rekor (um log de transparência público).
Para verificar:

~~~sh
cosign verify \
  --certificate-identity "mail@exemplo.com" \
  --certificate-oidc-issuer "https://github.com" \
  repositorio/imagem:tag
~~~