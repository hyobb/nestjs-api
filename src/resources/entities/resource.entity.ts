/* eslint-disable @typescript-eslint/ban-types */
import { BaseEntity } from '../../libs/entities/base.entity';
import { Column, Entity, ManyToMany, TableInheritance } from 'typeorm';

export enum ResourceType {
  DOCUMENT = 'document',
  URL = 'url',
  FILE = 'file',
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ResourceMetadata {}

@Entity('resources')
@TableInheritance({
  column: { name: 'type', type: 'enum', enum: ResourceType },
})
export abstract class Resource extends BaseEntity {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, type: 'enum', enum: ResourceType })
  type: ResourceType;

  @Column({
    nullable: false,
    type: 'jsonb',
    default: {},
  })
  metadata: ResourceMetadata;
}
