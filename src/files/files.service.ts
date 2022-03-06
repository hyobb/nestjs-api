import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { File } from './entities/file.entity';
import { CreateFileDto } from './dtos/create-file.dto';
import { FilesRepository } from './files.repository';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private readonly filesRepository: FilesRepository,
    @InjectPinoLogger(FilesService.name)
    private readonly logger: PinoLogger,
  ) {}

  async create(fileDto: CreateFileDto): Promise<File> {
    const file: File = await this.filesRepository.save(fileDto);

    this.logger.info('File is created');
    this.logger.info(file);

    return file;
  }
}
