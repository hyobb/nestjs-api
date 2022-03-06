import { IsNotEmpty, IsString } from 'class-validator';
import { ResourceType } from '../../resources/entities/resource.entity';
import { UrlMetadata } from '../entities/url.entity';

export class CreateUrlDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly type: ResourceType;

  @IsNotEmpty()
  readonly metadata: UrlMetadata;
}
