<div align="center">

- Use Serverless architecture (https://www.serverless.com/)
- Use NestJS framework (https://nestjs.com/)
- Use TypeORM for database setup and for orm (https://typeorm.io/)
- [Swagger](https://swagger.io/) API documentation based on JSDoc

- NODE_ENV=dev for non production env

---
## Getting Started

```zsh
$ npm install
$ yarn dev
```

## Commands

### Run

```zsh
# Setup postgresdb
# Run via docker
$ docker-compose up -d db

# Apply all available migrations
$ yarn migration:run

# Create new migration
$ yarn migration:create <name>

# Revert to previous available migrations
$ yarn migration:revert

# Generate new module
$ ROOT=<module_name> yarn api:gen
```

## Notice
###When have any requirements to change anything in the database, please create a new migration, not change manually. 
