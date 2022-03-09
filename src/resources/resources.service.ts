import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { CreateResourceDto } from './dtos/create-resource.dto';
import { File, FILE_CONTENT_TYPES } from '../files/entities/file.entity';
import { Resource, ResourceType } from './entities/resource.entity';
import { ResourcesRepository } from './resources.repository';
import { FilesService } from '../files/files.service';
import { UrlsService } from '../urls/urls.service';
import { DOCUMENT_CONTENT_TYPES } from '../documents/entities/document.entity';
import { DocumentsService } from '../documents/documents.service';
import { InvalidResourceTypeException } from '../libs/exceptions/resources/invalid-resource-type.exception';
import { NotFoundResourceException } from '../libs/exceptions/resources/not-found-resource.exception';
import { QueryResourceDto } from './dtos/query-resource.dto';
import { Url } from '../urls/entities/url.entity';
import { NotFoundLinkException } from '../libs/exceptions/links/not-found-link.exception';
import { BadRequestLinkException } from '../libs/exceptions/links/bad-request-link.exception';

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

  async findAll(queryDto: QueryResourceDto) {
    if (queryDto.type == undefined) {
      return this.resourcesRepository.find({
        relations: ['links'],
      });
    }

    switch (queryDto.type) {
      case ResourceType.DOCUMENT:
        return this.documentsService.findAll();
      case ResourceType.FILE:
        return this.filesService.findAll();
      case ResourceType.URL:
        return this.urlsService.findAll();
    }
  }

  async create(resourceDto: CreateResourceDto): Promise<Resource> {
    const resourceType: ResourceType = this.getResourceType(
      resourceDto.contentType,
    );

    switch (resourceType) {
      case ResourceType.FILE: {
        return await this.filesService.create(resourceDto);
      }
      case ResourceType.DOCUMENT: {
        return await this.documentsService.create(resourceDto);
      }
      case ResourceType.URL: {
        return await this.urlsService.create(resourceDto);
      }
      default:
        throw new InvalidResourceTypeException();
    }
  }

  async findOne(id): Promise<Resource> {
    const resource = await this.resourcesRepository.findOne(id, {
      relations: ['links'],
    });

    if (resource == undefined) {
      throw new NotFoundResourceException();
    }

    return resource;
  }

  async link(documentId: number, linkId: number) {
    const document = await this.documentsService.findOne(documentId);
    const link = await this.findOne(linkId);

    if (document == undefined) {
      throw new NotFoundResourceException();
    }

    if (link == undefined) {
      throw new NotFoundLinkException();
    }

    if (link.type == ResourceType.DOCUMENT) {
      throw new BadRequestLinkException();
    }

    this.documentsService.link(document, link as Url | File);
  }

  getResourceType(contentType): ResourceType {
    if (FILE_CONTENT_TYPES.includes(contentType)) {
      return ResourceType.FILE;
    }

    if (DOCUMENT_CONTENT_TYPES.includes(contentType)) {
      return ResourceType.DOCUMENT;
    }

    return ResourceType.URL;
  }
}
