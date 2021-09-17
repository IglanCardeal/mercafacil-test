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
3. [Como executar localmente](#comotestar)
4. [Arquitetura do sistema](#arquitetura)
5. [Testes](#testes)
   5.1 [Testes unitários](#unitarios)
6. CI - GitHub Actions
7. [Scripts](#scripts)
8. Autor

<div id="funcionalidades"></div>

## Funcionalidades

Este projeto consiste em uma API para cadastro de clientes dos tipos `macpá` e `varejâo` e estes podem cadastrar contatos de telefone em bases de dados diferentes.

<div id="prerequisitos"></div>

## Pré-requisitos

<div id="dockercompose"></div>

### Docker compose

<div id="makefile"></div>

### Makefile

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

<div id="scripts"></div>

## Scripts
