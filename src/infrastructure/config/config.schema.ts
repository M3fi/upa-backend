import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  PORT: Joi.number().default(3000),
  DB_HOST: Joi.string().default('localhost'),
  DB_PORT: Joi.number().default(5432),
  DB_USERNAME: Joi.string().default('upa'),
  DB_PASSWORD: Joi.string().default('upa_dev'),
  DB_DATABASE: Joi.string().default('upa'),
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),
  JWT_SECRET: Joi.string().min(16).default('dev-secret-do-not-use-in-prod'),
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
});
