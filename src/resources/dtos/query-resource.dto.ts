import { IsIn, IsOptional, IsString } from 'class-validator';
import { ResourceType } from '../entities/resource.entity';

export class QueryResourceDto {
  @IsOptional()
  @IsString()
  @IsIn(Object.values(ResourceType))
  readonly type?: ResourceType;
}
