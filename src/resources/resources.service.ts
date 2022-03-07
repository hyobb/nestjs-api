import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { CreateFileDto } from '../files/dtos/create-file.dto';
import { CreateResourceDto } from './dtos/create-resource.dto';
import { FileMetadata } from '../files/entities/file.entity';
import { Resource, ResourceType } from './entities/resource.entity';
import { ResourcesRepository } from './resources.repository';
import { FilesService } from 'src/files/files.service';
import { CreateUrlDto } from 'src/urls/dtos/create-url.dto';
import { UrlMetadata } from 'src/urls/entities/url.entity';
import { UrlsService } from 'src/urls/urls.service';
import { DocumentMetadata } from 'src/documents/entities/document.entity';
import { CreateDocumentDto } from 'src/documents/dtos/create-document.dto';
import { DocumentsService } from 'src/documents/documents.service';
import { InvalidResourceTypeException } from 'src/libs/exceptions/resources/invalid-resource-type.exception';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(Resource)
    private readonly resourcesRepository: ResourcesRepository,
    @Inject(FilesService)
    private readonly filesService: FilesService,
    @Inject(UrlsService)
    private readonly urlsService: UrlsService,
    @Inject(DocumentsService)
    private readonly documentsService: DocumentsService,
    @InjectPinoLogger(ResourcesService.name)
    private readonly logger: PinoLogger,
  ) {}

  async create(resourceDto: CreateResourceDto): Promise<Resource> {
    const resourceType: ResourceType = this.getResourceType(
      resourceDto.contentType,
    );

    switch (resourceType) {
      case ResourceType.FILE: {
        const path =
          'foo/boo/' +
          Math.random().toString(16) +
          '.' +
          resourceDto.contentType.split('/').pop();
        const metadata: FileMetadata = {
          path: path,
          size: Math.random(),
          mimeType: resourceDto.contentType,
        };

        const createFileDto: CreateFileDto = {
          name: resourceDto.name,
          type: resourceType,
          metadata: metadata,
        };

        const resource: Resource = await this.filesService.create(
          createFileDto,
        );

        return resource;
      }
      case ResourceType.DOCUMENT: {
        const metadata: DocumentMetadata = {
          doctype: resourceDto.contentType.split('.').pop(),
          creator: Math.random().toString(16),
          origin: Math.random().toString(16),
        };
        const createDocumentDto: CreateDocumentDto = {
          name: resourceDto.name,
          type: resourceType,
          metadata: metadata,
        };

        const resource: Resource = await this.documentsService.create(
          createDocumentDto,
        );

        return resource;
      }
      case ResourceType.URL: {
        const metadata: UrlMetadata = {
          path: resourceDto.target,
        };
        const createUrlDto: CreateUrlDto = {
          name: resourceDto.name,
          type: resourceType,
          metadata: metadata,
        };

        const resource: Resource = await this.urlsService.create(createUrlDto);

        return resource;
      }
      default:
        throw new InvalidResourceTypeException();
        break;
    }
  }

  async findOne(id) {
    return await this.documentsService.findOne(id);
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
