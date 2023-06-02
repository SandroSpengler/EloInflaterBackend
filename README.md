<div align='center'>
  <a href='https://eloinflaterinstance.azurewebsites.net/'>
    <img src='https://tinyurl.com/AzureShield'>
  </a>
  <a href='https://eloinflater.axfert.com'>
    <img src='https://tinyurl.com/BackendLogo'>
  </a>
  <a href='https://eloinflaterinstance.azurewebsites.net/swagger/'>
    <img src='https://img.shields.io/badge/Docs-Swagger-green?logo=swagger'>
  </a>
</div>

# **Eloinflater - Backend**

This project is a NodeJS Backend RESTful. The main purpose of this backend is to provide and curate Data from the Riot Games API for the game League of Legends. This Backend mainly tracks Summoners, their current rank and LP as well their played matches.

## Table of Contents

- [Overview](#Overview)
- [Getting started](#Getting-started)
  - [Installation](#Installation)
  - [Docker](#Docker-Image)
  - [Environment variables](#Environment-variables)
    - [Required](#Required-Environment-Variables)
    - [Optional](#Optional-Environment-Variables)
  - [Running the Backend](#Running-the-Backend)
    - [MongoDB](#MongoDB)
    - [Local](#Local)
    - [Docker](#Docker)
    - [Docker-Compose](#Docker-Compose)
- [Documentation](#Documentation)
- [Swagger](#Swagger)

## Overview

This project is one of 3 parts needed to accumulate and curate summoner data. The following diagram shows the full architecture on a higher level:

![Alt text](pictures/EloinflaterOverview.png)

## Getting started

### Installation

In order to run the Eloinflater Backend locally on your machine you need to clone the repository. To accomplish this use the following command:

`git clone https://github.com/SandroSpengler/EloInflaterBackend.git`

After cloning the repository you'll need to **install all required npm** packages. This project was created with [**Yarn**](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable) but [npm](https://docs.npmjs.com/cli/v6/commands/npm-install) and [pnpm](https://pnpm.io/installation) should work too.

`yarn install`

### Docker-Image

An up to date and publicly available Docker-Image is stored on [Dockerhub](https://hub.docker.com/r/sandrospengler/eloinflater/tags). Images are build for the Linux operating system and will require [WSL](https://learn.microsoft.com/en-us/windows/wsl/install) on Windows to run properly. To pull the image use the following command:

`docker pull sandrospengler/eloinflater:<VersionTag>`

**Don't forget to replace \<VersionTag> with the latest version!**

### Environment variables

In order to run the Backend a few environment variables are required:

#### Required Environment Variables

- **DB_CONNECTION**
  The connection string for a MongoDB
- **PORT**
  The port on which the backend is running

#### Optional Environment Variables

- **API_Key**
  The Riot Games API-Key for requesting data
- **NODE_ENV**
  The environment that the backend is deployed on can be **_development_**, _test_ or **_production_**
- **RUN_JOB**
  Tells the server to automatically refresh summoner data can be **_start_** or **_stop_**

If the backend will **run locally**, then you will need to create a **.env** file inside the backend directory and set the environment variables.

Should you choose to **run the Docker-Image** then you will need to pass the environment variables inside the **docker run** statement.

### Running the Backend

#### MongoDB

The backend requires a MongoDB database in order to read and write data. You'll to run a MongoDB instance and enter the provide the connection string via the environment variables.

The backend uses the npm package [Mongoose](https://www.npmjs.com/package/mongoose) and will create all required collections by itself after a database connetion has been established.

#### Local

In order to run the backend locally you'll need need to enter the following command into the cli:

`yarn dev`

This will run the **dev** script inside the package.json build the [tsoa](https://tsoa-community.github.io/docs/introduction.html) routes and allow hotreloading via [nodemon](https://www.npmjs.com/package/nodemon)

#### Docker

After you pulled the Docker-Image as described [here](#Docker-Image) you can run the backend using the default docker run command:

`docker run --name EloinflaterBackend -e DB_CONNECTION=<mongodb://> -e PORT=5000 -d sandrospengler/eloinflater:<VersionTag>`

**Don't forget to replace the variables \<VersionTag> and \<mongodb://>**

#### Docker-Compose

To improve the deployment experience you can also use docker-compose to run the backend:

```yaml
version: "3"

  eloinflater:
    container_name: "Eloinflater"
    image: sandrospengler/eloinflater:${tagId}
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - RUN_JOB=${RUN_JOB}
      - API_KEY=${API_KEY}
      - DB_CONNECTION=${DB_CONNECTION_LEAGUE}
      - VIRTUAL_HOST=<yourexamplehost.com>
      - LETSENCRYPT_HOST=<yourexamplehost.com>
    command: npm run prod
    volumes:
      - ./:/usr/src/app/Logs
```

## Documentation

### Swagger

The Backend provides an automatically generated swagger file, which includes all possible endpoints. You can view the [swagger file here](https://eloinflater.axfert.com/swagger/).
