import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { File, FileMetadata } from './entities/file.entity';
import { CreateFileDto } from './dtos/create-file.dto';
import { FilesRepository } from './files.repository';
import { CreateResourceDto } from '../resources/dtos/create-resource.dto';
import { ResourceType } from '../resources/entities/resource.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private readonly filesRepository: FilesRepository,
    @InjectPinoLogger(FilesService.name)
    private readonly logger: PinoLogger,
  ) {}

  async findAll(): Promise<File[]> {
    return await this.filesRepository.find();
  }

  async create(resourceDto: CreateResourceDto): Promise<File> {
    const path =
      'foo/boo/' +
      Math.random().toString(16) +
      '.' +
      resourceDto.contentType.split('/').pop();
    const metadata: FileMetadata = {
      path: path,
      size: Math.random(),
      mimeType: resourceDto.contentType,
    };

    const createFileDto: CreateFileDto = {
      name: resourceDto.name,
      type: ResourceType.FILE,
      metadata: metadata,
    };
    const file: File = await this.filesRepository.save(createFileDto);

    this.logger.info({ msg: 'File is created', file: file });

    return file;
  }
}
