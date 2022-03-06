import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { CreateFileDto } from '../files/dtos/create-file.dto';
import { CreateResourceDto } from './dtos/create-resource.dto';
import { FileMetadata } from '../files/entities/file.entity';
import { Resource, ResourceType } from './entities/resource.entity';
import { ResourcesRepository } from './resources.repository';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(Resource)
    private readonly resourcesRepository: ResourcesRepository,
    @Inject(FilesService)
    private readonly filesService: FilesService,
    @InjectPinoLogger(ResourcesService.name)
    private readonly logger: PinoLogger,
  ) {}

  async create(resourceDto: CreateResourceDto) {
    const resourceType: ResourceType = this.getResourceType(
      resourceDto.contentType,
    );

    if (resourceType == ResourceType.FILE) {
      const path =
        'foo/boo/' +
        Math.random().toString(16) +
        '.' +
        resourceDto.contentType.split('/').pop();
      const size = Math.random();
      const mimeType = resourceDto.contentType;
      const metadata: FileMetadata = {
        path: path,
        size: size,
        mimeType: mimeType,
      };

      const createFileDto: CreateFileDto = {
        name: resourceDto.name,
        type: resourceType,
        metadata: metadata,
      };

      const resource: Resource = await this.filesService.create(createFileDto);
      this.logger.info(resource);
      return resource;
    }
  }

  getResourceType(contentType): ResourceType {
    const FILE_CONTENT_TYPES = [
      'application/pdf',
      'application/octet-stream',
      'image',
      'video',
    ];

    const DOCUMENT_CONTENT_TYPES = [
      'application/vnd.google-apps.document',
      'application/vnd.google-apps.presentation',
      'application/vnd.google-apps.spreadsheet',
    ];

    if (FILE_CONTENT_TYPES.includes(contentType)) {
      return ResourceType.FILE;
    }

    if (DOCUMENT_CONTENT_TYPES.includes(contentType)) {
      return ResourceType.DOCUMENT;
    }

    return ResourceType.URL;
  }
}
