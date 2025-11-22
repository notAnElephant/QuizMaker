# Description of the project

TODO

# Tech stack

The project is built with:

- React (TypeScript)
- Hasura
- Tailwind
- Vite

## Hasura

Hasura is used to access the database. We are using [Hasura DDN](https://hasura.io/docs/3.0/quickstart/).

### Start Hasura locally

Run `docker-compose up`

Open the Hasura console by running `ddn console --local`

There, you must be able to see the tables and relationships, and even run GraphQL queries.
