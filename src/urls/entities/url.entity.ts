import { ChildEntity, Column, JoinTable, ManyToMany } from 'typeorm';
import {
  Resource,
  ResourceMetadata,
  ResourceType,
} from '../../resources/entities/resource.entity';

export interface UrlMetadata extends ResourceMetadata {
  path: string;
}

@ChildEntity(ResourceType.URL)
export class Url extends Resource {
  @Column({
    nullable: false,
    type: 'jsonb',
    default: {
      path: '',
    },
  })
  metadata: UrlMetadata;
}
