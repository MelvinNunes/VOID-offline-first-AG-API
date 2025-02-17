# VOID API (VERSION 1.0)

This is the api for the VOID interview tech phase. This is the first version of the API.
This project was bootstrapped using NodeJs v20.0 (Typescript), ExpressJs, Postgres database and Docker for containers.

# GETTING STARTED

To get started with the API you need to have Docker and Docker Compose installed (if you're only trying to run the app) and Node installed (if youre trying to run it by yourself).

- Docker Version that Was Used: 4.22.1 (118664)

- Or you can run it the old good way setting up a Postgres database and NodeJS enviroment. 😅😅

# CONFIGURATION

Firstly, you need to setup all the environment variables, create a new .env file and configure it like the .env.example file that you can find in the root of the project.

After setting up all environment variables, just run "docker compose up -d" and then wait for docker compose to start all services (containers).

You can check `localhost:8000/v1/health` (the standard port number is 8000) to check if the app is running!

- If youre willing to run it without docker, just set up the database in .env and install NodeJS and the use the command `yarn` to install dependecies and `yarn dev` to run the project (in the root of the project).

# DOCUMENTATION

You can also use the following url `localhost:8000/docs` to see the documentation (i used swagger for the API documentation).

# INTERNATIONALIZATION

This API has internationalization support, you can add `Accept-Language: pt/en` in your request header!

# DATABASE AND MIGRATIONS

We used prisma for the database!

All migrations are automatically applied when the application is started!

Check out the the package.json file for more information!

- To seed the database with an initial admin run:
  `npx prisma db seed`

# TESTING

For testing purposes, i used the supertest and jest libraries, you can run `yarn test` to run all tests.

# DEPLOY

To deploy the application, you can setup a EC2 instance with Terraform and deploy using Infrastructure as Code deployment!

You can also configure CI/CD operations for the enviroments.
