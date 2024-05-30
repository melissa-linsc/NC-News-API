# Northcoders News API

Welcome to my NC News Backend API Project! 

This API provides articles from various users about coding, cooking and football. It features comprehensive endpoints to manage users, articles, topics and comments and allows users to create, read and update articles, as well as delete comments.

Built using JavaScript, Express.js, PostgreSQL and TDD using Jest and Supertest

## Live Site

https://nc-news-api-ewli.onrender.com

## Endpoints

View all available endpoints at 

https://nc-news-api-ewli.onrender.com/api

## Installation

1. Clone the repository

```
git clone https://github.com/melissa-linsc/NC-News-API.git
```

2. Install dependencies

```
npm install
```

3. Set Up Environment Variables

Create .env files in the root directory

```
touch .env.test
touch .env.development
```

Open the files and set the PGDATABASE, for example:

```
PGDATABASE=database_name_here
```

## Seeding

1. Set up the databases 

```
npm run setup-dbs
```

2. Seed development database

```
npm run seed
```

3. Seed test database by running test suite

```
npm test app
```


## Prerequisites 

Requires Node.js v18.18.0 and PostgreSQL v14.12

--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
