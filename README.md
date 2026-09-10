# upa-backend

API REST para la plataforma educativa gamificada Upa!.

## Stack

- **Framework:** NestJS v11
- **ORM:** TypeORM
- **DB:** PostgreSQL (producción) / SQLite (desarrollo)
- **Cache:** Redis
- **Auth:** JWT + Passport
- **WebSockets:** Socket.IO

## Desarrollo

```bash
npm install
cp .env.example .env  # Configurar variables
npm run start:dev
```

### Con Docker Compose

```bash
docker compose -f docker-compose.dev.yml up
```

## Testing

```bash
npm test
npm run test:e2e
```

## Migraciones

```bash
npm run migration:run
npm run migration:generate -- -n MigrationName
npm run migration:revert
```

## Producción

```bash
docker compose -f docker-compose.prod.yml up -d
```

## API

La API se expone en `/api/v1`. Ver el contrato OpenAPI en el repo `upa-contracts`.
