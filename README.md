<div align="center">

# Back-end API

## Mercafacil Test

</div>

---

# badges

![1](https://img.shields.io/static/v1?label=tests&message=passing&color=green&style=flat)

# Status do Projeto

Finalizando...

# Tabela de conteúdos

1. [Funcionalidades](#funcionalidades)
2. [Pré-requisitos](#prerequisitos)
   2.1 [Docker compose](#dockercompose)
   2.2 [Makefile](#makefile)
   2.2 [Arquivo `.env`](#env)
3. [Como executar localmente](#comotestar)
4. [Arquitetura do sistema](#arquitetura)
5. [Testes](#testes)
   5.1 [Testes unitários](#unitarios)
6. CI - GitHub Actions
7. [Scripts](#scripts)
8. Autor

<div id="funcionalidades"></div>

## Funcionalidades

Este projeto consiste em uma API para cadastro de clientes dos tipos `macapá` e `varejâo` e estes podem cadastrar contatos de telefone em bases de dados diferentes.

<div id="prerequisitos"></div>

## Pré-requisitos

<div id="dockercompose"></div>

### Docker compose

<div id="makefile"></div>

### Makefile

<div id="env"></div>

### Arquivo `.env`

O projeto usa um arquivo do tipo `.env` é utilizado pela aplicação para usar as [variáveis de ambiente](https://en.wikipedia.org/wiki/Environment_variable). Neste arquivo é definido as credenciais que será utilizada pela aplicação. Na raíz do projeto, eu coloquei um arquivo `.env.example` para que você possa se basear para configurar sua credenciais.

Os valores informados e sua motivação são explicadas a seguir:

- `PORT` -> que defini a porta a ser usada pelo servidor.
- `PRIVATE_KEY` -> chave RSA privada que será usada pela classe `JsonWebTokenAdapter` para assinar o token de autenticação.
- `PUBLIC_KEY` -> chave RSA publica usado para verificar o token de autenticação.

No mesmo, também, devem ser informadas as credenciais para acesso a banco de dados que serão acessados pela aplicação:

1) credenciais para conexão com banco MySQL:

    ```none
    MYSQL_ROOT_PASSWORD=
    MYSQL_DATABASE=
    MYSQL_USER=
    MYSQL_PASSWORD=
    MYSQL_PORT=3306 # porta padrão
    MYSQL_ROOT_HOST= 127.0.0.1 # host padrão
    ```

2) credenciais para conexão com banco Postgres:

    ```none
    POSTGRES_PASSWORD=
    POSTGRES_USER=
    POSTGRES_PORT= 5432 # porta padrão
    POSTGRES_ROOT_HOST= 127.0.0.1 # host padrão
    ```



<div id="comotestar"></div>

## Como executar localmente

<div id="arquitetura"></div>

## Arquitetura do sistema

<div id="testes"></div>

## Testes

<div id="unitarios"></div>

### Testes unitarios

As configuraçôes de testes unitários estão no arquivo `jest.config.js` e durante a execuçâo destes testes, será exibido o prefixo `unit-tests`, destacando que tipo de teste está sendo executado.

A minha iniciativa de criar um sistema com módulos desacoplados (`controllers`,`services`, `repositories` e `adapters`) perimitiu a criaçâo de testes unitários dos principais módulos da aplicaçâo. Cada um desses módulos possuem o seu respectivo teste unitário no próprio arquivo de produçâo ou dentro da pasta `test` no mesmo diretório. Exemplo:

```none
  |
  |-- services
      |
      |--first-service
      |     first-service.test.ts # arquivo de teste
      |     first-service.ts      # arquivo de produçâo
      |
      |--second-service
      |     second-service.test.ts # arquivo de teste
      |     second-service.ts      # arquivo de produçâo
```

Ou:

```none
  |
  |-- services
      |
      |--first-service
      |     test
      |       first-service.test.ts # arquivo de teste
      |     first-service.ts        # arquivo de produçâo
      |
      |--second-service
      |     test
      |       second-service.test.ts # arquivo de teste
      |     second-service.ts        # arquivo de produçâo
```

Caso queira saber os scripts de teste unitário, consulte a secão [Scripts](#scripts). um script exemplo de destaque é o `test:coverage` (execute `yarn test:coverage`) que irá executar os testes e ainda mostrar no terminal a cobertura de testes unitários da aplicação. Será mostrado algo como:

![test-coverage](./docs/test-coverage.png)

<div id="scripts"></div>

## Scripts

Dentro do arquivo `package.json`, temos os scripts que podem ser executados no projeto. Os principais serão destacados a seguir com o comando de execução:

- `dev` -> `yarn dev` - inicia o servidor do projeto em modo de desenvolvimento.
- `lint` -> `yarn lint` - usa as regras do arquivo `.eslintrc` para análise de estilo do código.
- `test:unit` -> `yarn test:unit` - (Alias: `test:u`) executa os testes unitários.
- `test:unit:watch` -> `yarn test:unit:watch` - (Alias: `test:u:w`) executa os testes unitários em modo `--watch`, ou seja, cada alteração em arquivo de teste/produção irá executar os testes novamentes automaticamentes.
- `test:verbose` -> `yarn test:verbose` - (Alias: `test:v`) executa os testes unitários em modo `--verbose`, ou seja, irá exibir todas as informações dos testes executados.