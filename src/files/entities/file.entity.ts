import { ChildEntity, Column } from 'typeorm';
import {
  Resource,
  ResourceType,
} from '../../resources/entities/resource.entity';

export interface FileMetadata {
  path: string;
  mimeType: string;
  size: number;
}

@ChildEntity(ResourceType.FILE)
export class File extends Resource {
  @Column({
    nullable: false,
    type: 'jsonb',
    default: {
      path: '',
      mimeType: '',
      size: 0,
    },
  })
  metadata: FileMetadata;
}
