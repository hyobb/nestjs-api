import { Module } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { UrlsController } from './urls.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlsRepository } from './urls.repository';
import { Url } from './entities/url.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Url, UrlsRepository])],
  controllers: [UrlsController],
  providers: [UrlsService],
  exports: [UrlsService],
})
export class UrlsModule {}
