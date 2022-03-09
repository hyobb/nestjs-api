import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import {
  Doctype,
  Document,
  DocumentMetadata,
} from './entities/document.entity';
import { DocumentsRepository } from './documents.repository';
import { CreateDocumentDto } from './dtos/create-document.dto';
import { CreateResourceDto } from '../resources/dtos/create-resource.dto';
import { ResourceType } from '../resources/entities/resource.entity';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentsRepository: DocumentsRepository,
    @InjectPinoLogger(DocumentsService.name)
    private readonly logger: PinoLogger,
  ) {}

  async findAll(): Promise<Document[]> {
    return await this.documentsRepository.find({ relations: ['links'] });
  }

  async create(resourceDto: CreateResourceDto): Promise<Document> {
    const metadata: DocumentMetadata = {
      doctype: Doctype[resourceDto.contentType.split('.').pop()],
      creator: Math.random().toString(16),
      origin: Math.random().toString(16),
    };
    const createDocumentDto: CreateDocumentDto = {
      name: resourceDto.name,
      type: ResourceType.DOCUMENT,
      metadata: metadata,
    };

    const document: Document = await this.documentsRepository.save(
      createDocumentDto,
    );

    this.logger.info({ msg: 'Document is created', document: document });

    return document;
  }

  async findOne(documentId: number): Promise<Document> {
    const document: Document = await this.documentsRepository.findOne(
      documentId,
      {
        relations: ['links'],
      },
    );

    this.logger.info(document);
    return document;
  }
}
