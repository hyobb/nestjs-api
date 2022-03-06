import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { CreateResourceDto } from './dtos/create-resource.dto';
import { ResourcesService } from './resources.service';

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
    return resource;
  }
}
