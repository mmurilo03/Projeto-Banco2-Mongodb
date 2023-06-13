# Projeto de manipulação da API do Google Maps, com CRUD de eventos

## Sobre o projeto
#### O projeto consiste em uma aplicação com conexão com banco de dados. O usuário marca um local no maps, dá um nome para esse evento, descrição, data de início e fim e salva, a informação passada por ele é salva em um banco de dados e quando ele solicitar para ver os eventos, a aplicação lista todos os locais marcados junto com uma lista com os nomes salvos. Também há funções para remoção e edição dos eventos.

## Requisitos para execução da aplicação
- Mongo DB
- Preencher o .env.exemple com dados do banco
- Executar a aplicação com npm start e live server ou outra extensão que utilize

## Ferramentas utilizadas

- [API DO GOOGLE MAPS](https://developers.google.com/maps/documentation/javascript/overview?hl=pt-br)
- HTML, CSS, JAVASCRIPT 
- NODE [EXPRESS, MONGO, NODEMON, CORS]
- DOCKER [MONGO]

## Passo a passo de execução

- Clone o repositório
- Abra no vscode ou outra IDE
- Abra o terminal, digite npm i para baixar todas as dependências
- Crie um arquivo .env e pegue o preset que está em .env.exemple e preencha com o endereço do seu banco de dados
- No docker, inicie o mongo


