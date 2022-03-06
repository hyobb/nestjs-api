import { IsNotEmpty, IsString } from 'class-validator';
import { ResourceType } from '../../resources/entities/resource.entity';
import { DocumentMetadata } from '../entities/document.entity';

export class CreateDocumentDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly type: ResourceType;

  @IsNotEmpty()
  readonly metadata: DocumentMetadata;
}
