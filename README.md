# Sistema de Gerenciamento de Estoque de Ingredientes

## Visão Geral
Neste sistema é possível cadastrar ingredientes, além de listá-los, buscá-los, editá-los ou excluí-los. O foco do projeto é a integridade dos dados e uma experiência de usuário fluida.

## Stack Tecnológico

**Back-end:**
* Java 17
* Spring Boot 3.3.5
* JPA/Hibernate
* Flyway (Versionamento de Banco de Dados) 9.10.2
* Bean Validation
* Swagger/Springdoc OpenAI (Documentação da API) 2.6.0

**Banco de Dados:**
* PostgreSQL 16+

**Front-end:**
* React (+ Build Tool Vite)
* Node.js

## Como Executar o Projeto

### 1. Requisitos
* Java Development Kit (JDK) 17+ instalado.
* Node.js e npm.
* PostgreSQL instalado e rodando.

### 2. Configuração do Backend
1.  Crie um banco de dados no PostgreSQL chamado `ale_pessoa_db`.
2.  Clone este repositório.
3.  Abra o arquivo `src/main/resources/application.properties` e atualize as credenciais (`username` e `password`) do seu banco de dados local.
4.  Inicie a aplicação Spring Boot.
    * **Nota:** O **Flyway** executará automaticamente os scripts de migração (localizados em `db/migration`) para criar as tabelas necessárias.
    * O servidor iniciará na porta: **http://localhost:8080**

### 3. Documentação da API (Swagger)

* A documentação interativa das rotas do backend é fornecida automaticamente pelo Springdoc OpenAPI.
  Após iniciar o servidor, acesse:

* Swagger UI: http://localhost:8080/swagger-ui/index.html

* OpenAPI JSON: http://localhost:8080/v3/api-docs

* Essa interface permite visualizar, testar e compreender todos os endpoints disponíveis no sistema.

### 4. Configuração do Frontend
1.  Navegue até a pasta do projeto Front-end.
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```
    ou
    ```bash
    npm run dev --host
    ```

4.  Acesse a aplicação em: **http://localhost:5173/**

## Pontos de Destaque Técnico

* **Separação de Responsabilidades:** Utilização do **Flyway** para gerenciar a estrutura (Schema) e **Hibernate** apenas para manipulação de dados (ORM), mantendo a propriedade `ddl-auto` como `validate` para maior segurança em produção.
* **Validação Dupla:** Integridade garantida via **Bean Validation** no Back-end e validações de UX (bloqueio de inputs negativos e vazios) no Front-end.
* **Rotas e Componentes:** Estrutura organizada com React Router (`/cadastrar`, `/resultados`, `/editar`).