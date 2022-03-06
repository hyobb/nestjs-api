import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { Document } from './entities/document.entity';
import { DocumentsRepository } from './documents.repository';
import { CreateDocumentDto } from './dtos/create-document.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentsRepository: DocumentsRepository,
    @InjectPinoLogger(DocumentsService.name)
    private readonly logger: PinoLogger,
  ) {}

  async create(documentDto: CreateDocumentDto): Promise<Document> {
    const document: Document = await this.documentsRepository.save(documentDto);

    this.logger.info('Document is created');
    this.logger.info(document);

    return document;
  }
}
