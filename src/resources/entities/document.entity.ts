import { ChildEntity, Column } from 'typeorm';
import { Resource, ResourceType } from './resource.entity';

interface DocumentMetadata {
  doctype: string;
  creator: string;
  origin: string;
}

@ChildEntity(ResourceType.DOCUMENT)
export class Document extends Resource {
  @Column({
    nullable: false,
    type: 'jsonb',
    default: {
      doctype: '',
      creator: '',
      origin: '',
    },
  })
  metadata: DocumentMetadata;
}
