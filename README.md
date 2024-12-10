# DROPP

DROPP é um sistema de microserviços para gerenciar entregas, usuários, pedidos e pagamentos.

## Estrutura do Projeto

## Serviços

### API Gateway
Responsável por rotear as requisições para os serviços apropriados.

### Notification Service
Gerencia o envio de notificações aos usuários.

### Vehicle Service
Gerencia os veículos utilizados para entregas.

### Delivery Service
Gerencia o processo de entrega dos pedidos.

### User Service
Gerencia o cadastro e autenticação dos usuários.

### Order Service
Gerencia a criação e o acompanhamento dos pedidos.

### Payment Service
Gerencia os pagamentos e integrações com gateways de pagamento.

```
DROPP
|-- API GATEWAY
|   |-- NOTIFICATION SERVICE
|   |-- VEHICLE SERVICE
|       |-- VEICLE DATABASE
|   |-- DELIVERY SERVICE
|       |-- DELIVERY DATABASE
|   |-- USER SERVICE
|       |-- USER DATABASE
|   |-- ORDER SERVICE
|       |-- ORDER DATABASE
|   |-- PAIMENT SERVICE
|       |-- PAIMENT DATABASE
|       |-- PAIMENT GATEWAY
```