import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { CreateResourceDto } from '../resources/dtos/create-resource.dto';
import { ResourceType } from '../resources/entities/resource.entity';
import { CreateUrlDto } from './dtos/create-url.dto';
import { Url, UrlMetadata } from './entities/url.entity';
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

  async create(resourceDto: CreateResourceDto): Promise<Url> {
    const metadata: UrlMetadata = {
      path: this.getTransformedUrl(resourceDto.target),
    };
    const createUrlDto: CreateUrlDto = {
      name: resourceDto.name,
      type: ResourceType.URL,
      metadata: metadata,
    };

    const url: Url = await this.urlsRepository.save(createUrlDto);

    this.logger.info({ msg: 'Url is created!', url: url });

    return url;
  }

  private getTransformedUrl(url: string): string {
    const decodedUrl: string = decodeURI(url);
    const httpsURL: string = this.getHttpsURL(decodedUrl);
    return this.getShortedYoutubeUrl(httpsURL);
  }

  private getHttpsURL(url: string): string {
    return url.replace('http://', 'https://');
  }

  private getShortedYoutubeUrl(url: string): string {
    const stringToCheck = 'https://www.youtube.com/watch?v=-';
    const shortedUrl = 'https://youtu.be/embed/';

    if (url.startsWith(stringToCheck)) {
      const paramId = url.split(stringToCheck).pop();
      return shortedUrl + paramId;
    }
  }
}
