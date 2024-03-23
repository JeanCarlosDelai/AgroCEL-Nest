<h1 align="center"> AgroCEL </h1>

## 📄 Descrição do projeto

O sistema de caderno de campo digital a ser desenvolvido neste projeto irá permitir a gestão online da produção, aplicação, destinação e adubações realizados pelos produtores, proporcionando uma gestão mais eficiente, ecológica e econômica, permitindo assim que os produtores economizem o tempo lidando com a papelada e sejam mais ágeis ao tomar decisões e ter conhecimento de toda a produção e destinação online facilmente.

## 🛠 Funcionalidades do Projeto

- Cadastro de Usuários

- Criar, editar e adicionar propriedades

- Criar, editar e adicionar Áreas produtivas

- Criar, editar e adicionar Atividades(Em andamento)

- Gerar relatório do caderno de campo(Em andamento)

## 🚩 Requisitos

- Antes de iniciar deve ter o [NodeJS](https://nodejs.org/en/) instalado em sua máquina.
- Deve também instalar o [Docker](https://docs.docker.com/get-docker/).

## 💻 Como iniciar

- Para iniciar execute os seguintes comandos

- Clone o repositorio na sua máquina local.

```sh
git clone https://github.com/JeanCarlosDelai/AgroCEL.git
```

- Acesse a pasta clonada

```sh
cd AgroCEL
```

- Rode o comando para instalar as dependências

```sh
npm install
```

- Criar arquivo .env com base em arquivo de exemplo, para configuração de variáveis de ambiente:

```sh
cp .env_example .env
```

- Crie o Container Docker rodando o banco de dados PostgresSQL

```sh
docker run --name postgres -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres
```

- Rodar as migrações

```sh
npm run typeorm migration:run
```

- Inicie o servidor em desenvolvimento

```sh
npm run dev
```

## 🧪 Rodando os testes

- Para rodas os testes, digite o seguinte comando:

```sh
npm run test
```

### Verificar Cobertura

- Para verificar a cobertura de testes, execute o seguinte comando:

```sh
npm run test:coverage
```

## ✅ Tecnologias usadas

- `Typescript`
- `Node.js`
- `React`

## 👨🏻‍💻 Desenvolvedor

[<img src="https://avatars.githubusercontent.com/u/112594276?v=4" width="80px;"/>](https://github.com/JeanCarlosDelai)
