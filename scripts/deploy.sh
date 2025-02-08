#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print step with color
print_step() {
    echo -e "${YELLOW}[STEP]${NC} $1"
}

# Function to print success with color
print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Function to print error with color
print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if a command exists
check_command() {
    if ! command -v $1 &> /dev/null; then
        print_error "$1 is not installed. Please install it first."
        exit 1
    fi
}

# Function to wait for pod readiness
wait_for_pods() {
    namespace=$1
    echo "Waiting for pods in namespace $namespace to be ready..."
    kubectl wait --for=condition=ready pod -l app -n $namespace --timeout=300s
    if [ $? -ne 0 ]; then
        print_error "Timeout waiting for pods in namespace $namespace"
        exit 1
    fi
}

# Check required commands
print_step "Checking required commands..."
check_command kubectl
check_command helm

# Check if Kubernetes is accessible
if ! kubectl cluster-info &> /dev/null; then
    print_error "Cannot connect to Kubernetes cluster. Please check if your cluster is running."
    exit 1
fi
print_success "Kubernetes cluster is accessible"

# Create namespace
print_step "Creating dropp namespace..."

# Check if namespace exists and is terminating
if kubectl get namespace dropp -o jsonpath='{.status.phase}' 2>/dev/null | grep -q "Terminating"; then
    print_error "Namespace is stuck in Terminating state. Please run cleanup script first."
    echo "You can run: kubectl delete namespace dropp --force --grace-period=0"
    exit 1
fi

kubectl create namespace dropp 2>/dev/null || true

# Wait for namespace to be active
print_step "Waiting for namespace to be ready..."
for i in {1..30}; do
    STATUS=$(kubectl get namespace dropp -o jsonpath='{.status.phase}' 2>/dev/null)
    if [ "$STATUS" = "Active" ]; then
        print_success "Namespace is ready"
        break
    elif [ "$STATUS" = "Terminating" ]; then
        print_error "Namespace is in Terminating state. Please run cleanup script first."
        echo "You can run: kubectl delete namespace dropp --force --grace-period=0"
        exit 1
    fi
    if [ $i -eq 30 ]; then
        print_error "Namespace is not ready after 30 seconds"
        exit 1
    fi
    echo "Waiting for namespace to be ready... ($i/30)"
    sleep 1
done

# Apply secrets
print_step "Applying secrets..."
kubectl apply -f k8s/secrets.yaml
if [ $? -ne 0 ]; then
    print_error "Failed to apply secrets"
    exit 1
fi
print_success "Secrets applied successfully"

# Apply PostgreSQL init ConfigMap
print_step "Applying PostgreSQL init ConfigMap..."
kubectl apply -f k8s/postgres-init.yaml
if [ $? -ne 0 ]; then
    print_error "Failed to apply PostgreSQL init ConfigMap"
    exit 1
fi
print_success "PostgreSQL init ConfigMap applied successfully"

# Deploy PostgreSQL
print_step "Deploying PostgreSQL..."
kubectl apply -f k8s/postgres.yaml
if [ $? -ne 0 ]; then
    print_error "Failed to deploy PostgreSQL"
    exit 1
fi
print_success "PostgreSQL deployment started"

# Deploy RabbitMQ
print_step "Deploying RabbitMQ..."
kubectl apply -f k8s/rabbitmq.yaml
if [ $? -ne 0 ]; then
    print_error "Failed to deploy RabbitMQ"
    exit 1
fi
print_success "RabbitMQ deployment started"

# Wait for databases to be ready
print_step "Waiting for databases to be ready..."
sleep 10
wait_for_pods "dropp"

# Install Kong
print_step "Installing Kong..."
helm repo add kong https://charts.konghq.com
helm repo update
helm install kong kong/kong -n dropp -f kong/values.yaml --wait
if [ $? -ne 0 ]; then
    print_error "Failed to install Kong"
    exit 1
fi
print_success "Kong installed successfully"

# Deploy microservices
print_step "Deploying microservices..."
services=("user" "address" "order" "payment")
for service in "${services[@]}"; do
    print_step "Deploying $service service..."
    kubectl apply -f $service/k8s/deployment.yaml
    if [ $? -ne 0 ]; then
        print_error "Failed to deploy $service service"
        exit 1
    fi
    print_success "$service service deployment started"
done

# Wait for all pods to be ready
print_step "Waiting for all services to be ready..."
sleep 10
wait_for_pods "dropp"

# Apply ingress rules
print_step "Applying ingress rules..."
kubectl apply -f kong/ingress.yaml
if [ $? -ne 0 ]; then
    print_error "Failed to apply ingress rules"
    exit 1
fi
print_success "Ingress rules applied successfully"

# Get Kong proxy URL
print_step "Getting Kong proxy URL..."
KONG_IP=$(kubectl get svc -n dropp kong-kong-proxy -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
if [ -z "$KONG_IP" ]; then
    # If IP is not available, try hostname
    KONG_IP=$(kubectl get svc -n dropp kong-kong-proxy -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
fi

print_success "Deployment completed successfully!"
echo -e "${GREEN}You can access your services at:${NC}"
echo "User Service:     http://$KONG_IP/user"
echo "Address Service:  http://$KONG_IP/address"
echo "Order Service:    http://$KONG_IP/order"
echo "Payment Service:  http://$KONG_IP/payment"

# Print pods status
echo -e "\n${YELLOW}Current pods status:${NC}"
kubectl get pods -n dropp

# Print services status
echo -e "\n${YELLOW}Services status:${NC}"
kubectl get svc -n dropp
