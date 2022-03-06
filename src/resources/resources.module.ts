import { Module } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { ResourcesController } from './resources.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResourcesRepository } from './resources.repository';
import { Resource } from './entities/resource.entity';
import { FilesModule } from 'src/files/files.module';
import { UrlsModule } from 'src/urls/urls.module';
import { DocumentsModule } from 'src/documents/documents.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Resource, ResourcesRepository]),
    FilesModule,
    UrlsModule,
    DocumentsModule,
  ],
  controllers: [ResourcesController],
  providers: [ResourcesService],
  exports: [ResourcesService],
})
export class ResourcesModule {}
