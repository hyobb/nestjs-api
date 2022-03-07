import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { ResponseDocumentDto } from 'src/documents/dtos/response-document.dto';
import { Document } from 'src/documents/entities/document.entity';
import { File } from 'src/files/entities/file.entity';
import { ResponseFileDto } from 'src/files/dtos/response-file.dto';
import { CreateResourceDto } from './dtos/create-resource.dto';
import { Resource, ResourceType } from './entities/resource.entity';
import { ResourcesService } from './resources.service';
import { ResponseUrlDto } from 'src/urls/dtos/response-url.dto';
import { Url } from 'src/urls/entities/url.entity';
import { ResponseResourceDto } from './dtos/response-resource.dto';

@Controller('resources')
export class ResourcesController {
  constructor(
    private readonly resourcesService: ResourcesService,
    @InjectPinoLogger(ResourcesService.name)
    private readonly logger: PinoLogger,
  ) {}

  @Post()
  async create(@Body() resourceDto: CreateResourceDto) {
    const resource = await this.resourcesService.create(resourceDto);

    return resource;
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const resource = await this.resourcesService.findOne(id);

    return this.getResponseDto(resource);
  }

  private getResponseDto(resource: Resource): ResponseResourceDto {
    switch (resource.type) {
      case ResourceType.DOCUMENT:
        return new ResponseDocumentDto(resource as Document);
      case ResourceType.FILE:
        return new ResponseFileDto(resource as File);
      case ResourceType.URL:
        return new ResponseUrlDto(resource as Url);
    }
  }
}
