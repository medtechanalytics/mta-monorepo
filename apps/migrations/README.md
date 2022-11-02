# DB Migrations

#### Create local environment files to run migrations locally

Create local .env files for each environment, e.g.:
```bash
#  .env.production-migration.local
RDS_SECRET=arn:aws:secretsmanager:us-east-1:1234567890:secret:production/db/mydb_production
RDS_MIGRATIONS_PATH=src/migrations
RDS_SEEDS_PATH=src/seeds
```

#### To deploy to QA environment

```bash
$ aws-vault exec my-account -- rushx deploy --stage=qa
```

#### Create a migration

```bash
$ rushx create-migration MigrationName
```


#### Run migrations for QA

```bash
$ cd src
$ aws-vault exec my-account -- rushx migrate-qa
```


#### Rollback migrations for QA

```bash
$ aws-vault exec my-account -- rushx knex-rollback-qa
```

#### Seed QA

```bash
$ cd src
$ aws-vault exec my-account -- rushx knex-seed-qa
```
