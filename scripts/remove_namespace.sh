#!/bin/bash

NAMESPACE="dropp"

# Remover finalizers de todos os recursos no namespace
for type in $(kubectl api-resources --verbs=list --namespaced -o name); do
  echo "Processando recurso: $type"
  kubectl get $type -n $NAMESPACE -o json | jq '.items[] | select(.metadata.finalizers != null) | .metadata.name' | xargs -r -I {} kubectl patch $type {} -n $NAMESPACE -p '{"metadata":{"finalizers":[]}}' --type=merge
done

# Criar um arquivo temporário com a definição do namespace
kubectl get namespace $NAMESPACE -o json > tmp_ns.json

# Remover finalizers do namespace e criar novo manifesto
cat tmp_ns.json | jq 'del(.spec.finalizers)' | jq 'del(.metadata.finalizers)' > tmp_ns_cleaned.json

# Forçar a substituição do namespace
kubectl replace --raw "/api/v1/namespaces/$NAMESPACE/finalize" -f tmp_ns_cleaned.json

# Remover arquivos temporários
rm tmp_ns.json tmp_ns_cleaned.json

# Verificar status do namespace
echo "Status do namespace após a tentativa de remoção:"
kubectl get namespace $NAMESPACE