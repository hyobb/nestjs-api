import { IsNotEmpty, IsNumber } from 'class-validator';
import { ResourceType } from '../entities/resource.entity';

export class LinkResourceDto {
  @IsNotEmpty()
  @IsNumber()
  readonly link_id: number;
}
