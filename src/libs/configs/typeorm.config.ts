import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const TypeormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  username: 'postgres',
  password: 'root',
  port: 5432,
  host: 'postgres',
  database: 'postgres',
  synchronize: true,
  entities: ['dist/**/*.entity{.ts,.js}'],
  namingStrategy: new SnakeNamingStrategy(),
};
