import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const TestTypeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  database: 'test-pretask',
  autoLoadEntities: true,
  dropSchema: true,
  logging: false,
  retryAttempts: 3,
  retryDelay: 500,
  synchronize: true,
  keepConnectionAlive: true,
};
