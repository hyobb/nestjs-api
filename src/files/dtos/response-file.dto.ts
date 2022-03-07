import { Exclude, Expose } from 'class-transformer';
import { ResponseResourceDto } from 'src/resources/dtos/response-resource.dto';
import { ResourceType } from 'src/resources/entities/resource.entity';
import { FileMetadata, File } from '../entities/file.entity';

export class ResponseFileDto implements ResponseResourceDto {
  @Exclude() private readonly _id: number;
  @Exclude() private readonly _name: string;
  @Exclude() private readonly _metadata: FileMetadata;
  @Exclude() private readonly _type: ResourceType;
  @Exclude() private readonly _createdAt: Date;
  @Exclude() private readonly _updatedAt: Date;

  constructor(file: File) {
    this._id = file.id;
    this._name = file.name;
    this._metadata = file.metadata;
    this._type = file.type;
    this._createdAt = file.createdAt;
    this._updatedAt = file.updatedAt;
  }

  @Expose()
  get id(): string {
    return this._id.toString();
  }

  @Expose()
  get name(): string {
    return this._name;
  }

  @Expose()
  get metadata(): FileMetadata {
    return this._metadata;
  }

  @Expose()
  get type(): string {
    return this._type.toString();
  }
}
