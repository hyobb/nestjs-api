import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from '../documents/entities/document.entity';
import { DocumentsService } from '../documents/documents.service';
import { File } from '../files/entities/file.entity';
import { FilesService } from '../files/files.service';
import { Url } from '../urls/entities/url.entity';
import { UrlsService } from '../urls/urls.service';
import { getConnection, Repository } from 'typeorm';
import { Resource, ResourceType } from './entities/resource.entity';
import { ResourcesService } from './resources.service';
import { LoggerModule } from 'nestjs-pino';
import { ResourcesRepository } from './resources.repository';
import { FilesModule } from '../files/files.module';
import { UrlsModule } from '../urls/urls.module';
import { DocumentsModule } from '../documents/documents.module';
import { ResourcesModule } from './resources.module';
import { FilesRepository } from '../files/files.repository';
import { pinoLoggerConfig } from '../libs/configs/pino-logger.config';
import { UrlsRepository } from '../urls/urls.repository';
import { DocumentsRepository } from '../documents/documents.repository';
import { CreateResourceDto } from './dtos/create-resource.dto';
import { QueryResourceDto } from './dtos/query-resource.dto';
import { NotFoundResourceException } from '../libs/exceptions/resources/not-found-resource.exception';
import { TestTypeOrmConfig } from '../libs/configs/test-typeorm.config';

describe('ResourcesService', () => {
  let resourcesService: ResourcesService;
  let resourcesRepository: Repository<Resource>;
  let filesService: FilesService;
  let filesRepository: Repository<File>;
  let urlsService: UrlsService;
  let urlsRepository: Repository<Url>;
  let documentsService: DocumentsService;
  let documentsRepository: Repository<Document>;
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(TestTypeOrmConfig),
        LoggerModule.forRoot(pinoLoggerConfig),
        ResourcesModule,
        FilesModule,
        UrlsModule,
        DocumentsModule,
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    filesRepository = await module.get<FilesRepository>(FilesRepository);
    filesService = await module.get(FilesService);
    urlsRepository = await module.get<UrlsRepository>(UrlsRepository);
    urlsService = await module.get(UrlsService);
    documentsRepository = await module.get<DocumentsRepository>(
      DocumentsRepository,
    );
    documentsService = await module.get<DocumentsService>(DocumentsService);
    resourcesRepository = await module.get<ResourcesRepository>(
      ResourcesRepository,
    );
    resourcesService = await module.get<ResourcesService>(ResourcesService);
    await getConnection().synchronize(true);
  });

  describe('create()', () => {
    describe('요청한 리소스가 file 타입이라면', () => {
      const createResourceDto: CreateResourceDto = {
        contentType: 'application/pdf',
        target: 'example.pdf',
        name: 'example_pdf',
      };

      it('File 리소스를 생성한다', async () => {
        const resource = await resourcesService.create(createResourceDto);

        expect(resource.type).toEqual(ResourceType.FILE);
      });
    });

    describe('요청한 리소스가 url 타입이라면', () => {
      const createResourceDto: CreateResourceDto = {
        contentType: 'plain/text',
        target: 'https://naver.com/news/123',
        name: '네이버',
      };

      it('Url 리소스를 생성한다.', async () => {
        const resource = await resourcesService.create(createResourceDto);

        expect(resource.type).toEqual(ResourceType.URL);
      });
    });

    describe('요청한 리소스가 document 타입이라면', () => {
      const createResourceDto: CreateResourceDto = {
        contentType: 'application/vnd.google-apps.document',
        target: 'https://docs.google.com/1231/3211',
        name: '도큐먼트',
      };

      it('Document 리소스를 생성한다.', async () => {
        const resource = await resourcesService.create(createResourceDto);

        expect(resource.type).toEqual(ResourceType.DOCUMENT);
      });
    });
  });

  describe('findAll()', () => {
    beforeEach(async () => {
      const mockUrlResource = {
        name: 'URL리소스',
        metadata: {
          path: 'https://nave.com/news',
        },
        type: ResourceType.URL,
      };

      await urlsRepository.save(mockUrlResource);

      const mockFileResource = {
        name: 'example.pdf',
        metadata: {
          path: 'foo/boo/example.pdf',
          mimeType: 'application/pdf',
          size: 0,
        },
        type: ResourceType.FILE,
      };

      await filesRepository.save(mockFileResource);

      const mockDocumentResource = {
        name: '도큐먼트😄',
        metadata: {
          doctype: 'doc',
          creator: '작성자',
          origin: '123_origin',
        },
        type: ResourceType.DOCUMENT,
      };

      await documentsRepository.save(mockDocumentResource);
    });

    describe('인자에 type값이 없다면', () => {
      const queryDto: QueryResourceDto = {};

      it('모든 리소스를 가져온다', async () => {
        const resources = await resourcesService.findAll(queryDto);

        expect(resources.length).toEqual(3);
      });
    });

    describe('인자에 type값이 있다면', () => {
      const queryDto: QueryResourceDto = {
        type: ResourceType.DOCUMENT,
      };

      it('type에 해당하는 리소스를 가져온다', async () => {
        const resources = await resourcesService.findAll(queryDto);

        expect(resources.length).toEqual(1);
        expect(resources[0].type).toEqual(ResourceType.DOCUMENT);
      });
    });
  });

  describe('findOne()', () => {
    beforeEach(async () => {
      const mockUrlResource = {
        name: 'URL리소스',
        metadata: {
          path: 'https://nave.com/news',
        },
        type: ResourceType.URL,
      };

      await urlsRepository.save(mockUrlResource);
    });

    describe('리소스가 존재할 경우', () => {
      it('리소스를 가져온다', async () => {
        const result = await resourcesService.findOne(1);

        expect(result.id).toEqual(1);
        expect(() => {}).not.toThrow(NotFoundResourceException);
      });
    });

    describe('리소스가 존재하지 않을 경우', () => {
      it('NotFoundResourceException 에러가 발생한다', async () => {
        const result = await resourcesService.findOne(10000);
        expect(() => {}).toThrow(NotFoundResourceException);
      });
    });
  });

  it('should be defined', () => {
    expect(resourcesService).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await resourcesRepository.query('DELETE FROM resources');
  });
});
