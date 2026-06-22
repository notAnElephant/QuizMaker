# Hasura Migrations

Store SQL migrations for the default Hasura source in `hasura/migrations/default/`.

Recommended directory layout:

```text
hasura/migrations/default/
  1712345678901_create_questions_table/
    up.sql
    down.sql
```

Suggested local workflow with the Hasura CLI:

```bash
hasura migrate create "create_questions_table" --database-name default --from-server --project hasura
hasura migrate apply --database-name default --project hasura
hasura metadata apply --project hasura
```

Commit migrations together with matching metadata changes.
