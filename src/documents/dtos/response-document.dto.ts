import { Exclude, Expose } from 'class-transformer';
import { ResponseFileDto } from 'src/files/dtos/response-file.dto';
import { File } from 'src/files/entities/file.entity';
import { ResponseResourceDto } from 'src/resources/dtos/response-resource.dto';
import { ResourceType } from 'src/resources/entities/resource.entity';
import { ResponseUrlDto } from 'src/urls/dtos/response-url.dto';
import { Url } from 'src/urls/entities/url.entity';
import { Document, DocumentMetadata } from '../entities/document.entity';

export class ResponseDocumentDto implements ResponseResourceDto {
  @Exclude() private readonly _id: number;
  @Exclude() private readonly _name: string;
  @Exclude() private readonly _metadata: DocumentMetadata;
  @Exclude() private readonly _type: ResourceType;
  @Exclude() private readonly _links: Array<Url | File>;
  @Exclude() private readonly _createdAt: Date;
  @Exclude() private readonly _updatedAt: Date;

  constructor(document: Document) {
    this._id = document.id;
    this._name = document.name;
    this._metadata = document.metadata;
    this._type = document.type;
    this._links = document.links;
    this._createdAt = document.createdAt;
    this._updatedAt = document.updatedAt;
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
  get metadata(): DocumentMetadata {
    return this._metadata;
  }

  @Expose()
  get type(): string {
    return this._type.toString();
  }

  @Expose()
  get links(): ResponseResourceDto[] {
    return this._links.map((resource) => {
      switch (resource.type) {
        case ResourceType.URL:
          return new ResponseUrlDto(resource as Url);
        case ResourceType.FILE:
          return new ResponseFileDto(resource as File);
      }
    });
  }
}
