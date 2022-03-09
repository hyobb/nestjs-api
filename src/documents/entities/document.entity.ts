import { File } from '../../files/entities/file.entity';
import { Url } from '../../urls/entities/url.entity';
import { ChildEntity, Column, JoinTable, ManyToMany } from 'typeorm';
import {
  Resource,
  ResourceMetadata,
  ResourceType,
} from '../../resources/entities/resource.entity';

export interface DocumentMetadata extends ResourceMetadata {
  doctype: string;
  creator: string;
  origin: string;
}

export enum Doctype {
  document = 'doc',
  presentation = 'presentation',
  spreadsheet = 'sheet',
}

export const DOCUMENT_CONTENT_TYPES = [
  'application/vnd.google-apps.document',
  'application/vnd.google-apps.presentation',
  'application/vnd.google-apps.spreadsheet',
];

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

  @ManyToMany(() => Resource, (resource) => resource.id)
  @JoinTable({
    name: 'document_links',
    joinColumn: {
      name: 'document_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'link_id',
      referencedColumnName: 'id',
    },
  })
  links: Array<Url | File>;
}
