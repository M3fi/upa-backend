import { DataSource, DataSourceOptions } from 'typeorm';
import * as path from 'path';

// Load .env from the backend root
import { config } from 'dotenv';
config({ path: path.resolve(__dirname, '../.env') });

const options: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'upa',
  password: process.env.DB_PASSWORD || 'upa_dev',
  database: process.env.DB_DATABASE || 'upa',
  entities: [__dirname + '/**/*.orm-entity.{ts,js}'],
  migrations: [__dirname + '/migrations/*.{ts,js}'],
  migrationsTableName: 'typeorm_migrations',
  synchronize: false,
};

export default new DataSource(options);
