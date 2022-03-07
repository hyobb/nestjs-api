import { File } from 'src/files/entities/file.entity';
import { Url } from 'src/urls/entities/url.entity';
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
