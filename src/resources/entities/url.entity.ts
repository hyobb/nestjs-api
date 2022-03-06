import { ChildEntity, Column } from 'typeorm';
import { Resource, ResourceType } from './resource.entity';

interface UrlMetadata {
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
