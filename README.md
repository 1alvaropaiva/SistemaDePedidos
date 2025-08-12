# Sistema de Pedidos

## 📌 Visão Geral
Sistema de gerenciamento de pedidos para lojas no geral, com:
- Cadastro de usuários, produtos e categorias
- Processo completo de pedidos (criação, pagamento, status)
- Relacionamentos complexos entre entidades

## 🛠 Tecnologias
- Java 21
- Spring Boot 3
- Spring Data JPA
- H2 Database (teste)
- Maven (3.9)

## 📋 Entidades Principais
| Entidade       | Descrição                     |
|----------------|-------------------------------|
| User           | Clientes do sistema           |
| Product        | Itens para venda              |
| Order          | Pedidos dos usuários          |
| OrderItem      | Itens dentro de um pedido     |
| Payment        | Pagamentos associados         |

## ▶ Como Executar
1. Clone o repositório
2. Rode `mvn spring-boot:run` no terminal.
3. Acesse `http://localhost:8080`.

## 🧪 Testes
Use o perfil `test` para dados mockados:
`--spring.profiles.active=test`

## 💭 Futuramente
Features que irei adicionar:
1. Frontend 
2. Deploy
3. Banco de dados PostgreSQL
