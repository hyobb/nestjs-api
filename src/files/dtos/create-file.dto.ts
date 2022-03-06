import { IsNotEmpty, IsString } from 'class-validator';
import { FileMetadata } from '../entities/file.entity';
import { ResourceType } from '../../resources/entities/resource.entity';

export class CreateFileDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly type: ResourceType;

  @IsNotEmpty()
  readonly metadata: FileMetadata;
}
