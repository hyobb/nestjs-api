import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { CreateUrlDto } from './dtos/create-url.dto';
import { Url } from './entities/url.entity';
import { UrlsRepository } from './urls.repository';

@Injectable()
export class UrlsService {
  constructor(
    @InjectRepository(Url)
    private readonly urlsRepository: UrlsRepository,
    @InjectPinoLogger(UrlsService.name)
    private readonly logger: PinoLogger,
  ) {}

  async findAll(): Promise<Url[]> {
    return await this.urlsRepository.find();
  }

  async create(urlDto: CreateUrlDto): Promise<Url> {
    const url: Url = await this.urlsRepository.save(urlDto);
    this.logger.info('Url is created!');
    this.logger.info('Url:' + url);

    return url;
  }
}
