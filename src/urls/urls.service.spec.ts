import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { CreateResourceDto } from '../resources/dtos/create-resource.dto';
import { Resource, ResourceType } from '../resources/entities/resource.entity';
import { getConnection, Repository } from 'typeorm';
import { pinoLoggerConfig } from '../libs/configs/pino-logger.config';
import { TestTypeOrmConfig } from '../libs/configs/test-typeorm.config';
import { Url } from './entities/url.entity';
import { UrlsModule } from './urls.module';
import { UrlsRepository } from './urls.repository';
import { UrlsService } from './urls.service';
import { Document } from '../documents/entities/document.entity';

describe('UrlsService', () => {
  let service: UrlsService;
  let repository: Repository<Url>;
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          ...TestTypeOrmConfig,
          entities: [Resource, Document, Url],
        }),
        LoggerModule.forRoot(pinoLoggerConfig),
        UrlsModule,
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
    repository = await module.get<UrlsRepository>(UrlsRepository);
    service = await module.get<UrlsService>(UrlsService);

    await getConnection().synchronize(true);
  });

  describe('create()', () => {
    describe('target이 http://로 시작한다면', () => {
      const createResourceDto: CreateResourceDto = {
        contentType: 'plain/text',
        target: 'http://naver.com/news/123',
        name: '네이버',
      };

      it('http://를 https://로 변경하여 Url 리소스를 생성한다.', async () => {
        const resource = await service.create(createResourceDto);

        expect(resource.type).toEqual(ResourceType.URL);
        expect(resource.metadata.path.startsWith('https://')).toBeTruthy();
      });
    });

    describe('target이 https://www.youtube.com/watch?v=-{paramId}의 형태라면', () => {
      const createResourceDto: CreateResourceDto = {
        contentType: 'plain/text',
        target: 'https://www.youtube.com/watch?v=-1234',
        name: '네이버',
      };

      it('https://youtu.be/embed/{paramId}의 형태로 변경하여 Url 리소스를 생성한다.', async () => {
        const resource = await service.create(createResourceDto);

        expect(resource.type).toEqual(ResourceType.URL);
        expect(
          resource.metadata.path.startsWith('https://youtu.be/embed/'),
        ).toBeTruthy();
      });
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
