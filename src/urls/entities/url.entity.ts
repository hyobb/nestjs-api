import { ChildEntity, Column } from 'typeorm';
import {
  Resource,
  ResourceType,
} from '../../resources/entities/resource.entity';

export interface UrlMetadata {
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
