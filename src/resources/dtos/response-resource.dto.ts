import { ResourceMetadata } from '../entities/resource.entity';

export interface ResponseResourceDto {
  get id(): string;
  get name(): string;
  get metadata(): ResourceMetadata;
  get type(): string;
}
