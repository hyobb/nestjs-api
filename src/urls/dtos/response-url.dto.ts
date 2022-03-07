import { Exclude, Expose } from 'class-transformer';
import { ResponseResourceDto } from 'src/resources/dtos/response-resource.dto';
import { ResourceType } from 'src/resources/entities/resource.entity';
import { Url, UrlMetadata } from '../entities/url.entity';

export class ResponseUrlDto implements ResponseResourceDto {
  @Exclude() private readonly _id: number;
  @Exclude() private readonly _name: string;
  @Exclude() private readonly _metadata: UrlMetadata;
  @Exclude() private readonly _type: ResourceType;
  @Exclude() private readonly _createdAt: Date;
  @Exclude() private readonly _updatedAt: Date;

  constructor(url: Url) {
    this._id = url.id;
    this._name = url.name;
    this._metadata = url.metadata;
    this._type = url.type;
    this._createdAt = url.createdAt;
    this._updatedAt = url.updatedAt;
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
  get metadata(): UrlMetadata {
    return this._metadata;
  }

  @Expose()
  get type(): string {
    return this._type.toString();
  }
}
