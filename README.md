# Tayo-Quno Backend Code Challenge

This is my completed source code for the Quno code challenge.

## Setting up the project locally

To set up the project locally, do the following:

1. Install and execute [Docker](https://www.docker.com/)
2. Run `npm install` on the root of the project folder to install the dependencies.
3. Run `docker-compose -f docker-compose.yml up` on the root of the project to start the database.
4. Run the migrations by executing `db-migrate up initialize` (you can rollback the migration by running `db-migrate down`).
5. Move the `migrations folder`, the `seed folder` and the `database.json` file to the root directory, if you get an error while executing the above and then try the migration commands again.
6. Run `npm start` to start the example server

## Running Tests

1. Run `jest index.unit.test` to run all unit tests.
2. Run `jest index.integration.test` to run all integration tests.

## Deploying application to AWS

To deploy the application to AWS Lambda Service, do the following:

1. Run `tsc --build` to transpile the Typescript code to Javascript code. AWS Lambda can only run javascript code so the ts code needs to be converted to js.
2. Run `serverless deploy` to deploy all functions and dependencies to AWS.
3. If there is a deployment skip message and functions are not being deployed, then run `serverless deploy --stage dev --force` to do a force deployment.

## Environment Variables

The following environment variables need to be set on each function after deployment to AWS:

1. QUNO_DB_CONN_PROD: `{"database": "quno_challenge_db","host": "[your host ip on prod]","port": "[your host port on prod]","user": "[your host user on prod]","password": "[your host user password on prod]"}`
2. QUNO_DB_CONN_TEST: `{"database": "quno_challenge_db","host": "[your host ip on dev]","port": "[your host port on dev]","user": "[your host user on dev]","password": "[your host user password on dev]"}`
3. QUNO_SCORE_MAPPING: `{"0":"Bad","6":"Regular","7":"Good","8":"Very Good","9":"Excelent"}`
4. QUNOENV: `test`

1. QUNO_DB_CONN_PROD: connection details for PostgreSQL database on production environment
2. QUNO_DB_CONN_TEST: connection details for PostgreSQL database on dev environment
3. QUNO_SCORE_MAPPING: object representing mapping that will be used to determine `qunoscoreText` of every doctor on the platform
4. QUNOENV: test: current environment of the application. 

## Functions

1. The postdoctor function accepts a JSON object describing the new doctor and returns a HTTP 202 response which signals that the request has been
   recieved for processing. This request is then forwarded to an SNS queue that would be treated by another function

2. The getDoctors function if successful returns a HTTP status code 200 and a list of paginated doctors either in descending or ascending order.
   The function also returns a particular doctor if an Id is present in the request.

3. The createDoctor functions is triggered when the postdoctor function publishes a message to a topic in SNS. This is the function that creates the record in the database.

I used an asynchronous approach to ensure that the postdoctor endpoint returns a response in less than 300ms. I acheived this using a pub/sub design pattern implemented with AWS SNS.




