import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { pinoLoggerConfig } from './libs/configs/pino-logger.config';
import { TypeormConfig } from './libs/configs/typeorm.config';
import { ResourcesModule } from './resources/resources.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(TypeormConfig),
    LoggerModule.forRoot(pinoLoggerConfig),
    ResourcesModule,
    FilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
