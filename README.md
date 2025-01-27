# DROPP - API de Logística Urbana

## Visão Geral

A DROPP oferece uma API REST moderna e escalável que atua como ponto central de integração para operações de logística urbana. Esta API permite que utilizadores e sistemas externos interajam de forma segura com nossa plataforma através de diversos microserviços especializados.

### Principais Funcionalidades

- Gestão de utilizadores (clientes e condutores)
- Gestão de endereços
- Processamento de pedidos
- Sistema de pagamentos
- Integração com sistemas externos

## Requisitos

- Docker
- Docker Compose

## Instalação e Execução

1. Clone o repositório
2. No diretório raiz do projeto, execute:
```bash
docker-compose up -d
```

## Testar a API

Disponibilizamos várias opções para testar a API:

### Postman
1. Importe o arquivo `postman_collection.json` localizado na raiz do projeto
2. A coleção inclui todos os endpoints disponíveis com exemplos de requisições

### REST Client
1. Utilize o arquivo `request.http` na raiz do projeto
2. Execute as requisições diretamente da sua IDE (se suportar REST Client)

### Fluxo de Testes Recomendado

Para testar completamente o fluxo da aplicação, siga esta sequência:

1. Criação de Utilizadores
   - Registar novo cliente
   - Registar novo condutor
   - Login como cliente

2. Gestão de Endereços
   - Adicionar morada ao perfil do cliente

3. Processamento de Pedidos
   - Criar nova order
   - Visualizar detalhes da order

4. Pagamentos
   - Criar novo pagamento
   - Confirmar conclusão do pagamento