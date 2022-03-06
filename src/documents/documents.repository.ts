import { EntityRepository, Repository } from 'typeorm';
import { Document } from './entities/document.entity';

@EntityRepository(Document)
export class DocumentsRepository extends Repository<Document> {}
