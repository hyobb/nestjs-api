import { IsNotEmpty, IsString } from 'class-validator';

export class CreateResourceDto {
  @IsString()
  @IsNotEmpty()
  readonly contentType: string;

  @IsString()
  @IsNotEmpty()
  readonly target: string;

  @IsString()
  @IsNotEmpty()
  readonly name: string;
}
