#!/bin/bash

# Remove todos os pods
kubectl delete pods --all --all-namespaces

# Remove todos os deployments
kubectl delete deployments --all --all-namespaces

# Remove todos os services
kubectl delete services --all --all-namespaces

# Remove todos os statefulsets
kubectl delete statefulsets --all --all-namespaces

# Remove todos os daemonsets
kubectl delete daemonsets --all --all-namespaces

# Remove todos os replicasets
kubectl delete replicasets --all --all-namespaces

# Remove todos os jobs
kubectl delete jobs --all --all-namespaces

# Remove todos os cronjobs
kubectl delete cronjobs --all --all-namespaces

# Remove todos os configmaps
kubectl delete configmaps --all --all-namespaces

# Remove todos os secrets
kubectl delete secrets --all --all-namespaces

# Remove todos os persistentvolumeclaims
kubectl delete pvc --all --all-namespaces

# Remove todos os persistentvolumes
kubectl delete pv --all

# Remove todos os ingresses
kubectl delete ingress --all --all-namespaces

# Remove todos os horizontalpodautoscalers
kubectl delete hpa --all --all-namespaces

# Aguarda alguns segundos para garantir que tudo foi removido
sleep 10

# Verifica o status do cluster
echo "Status do cluster após a limpeza:"
kubectl get all --all-namespaces