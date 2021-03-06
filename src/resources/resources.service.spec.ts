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
    describe('????????? ???????????? file ???????????????', () => {
      const createResourceDto: CreateResourceDto = {
        contentType: 'application/pdf',
        target: 'example.pdf',
        name: 'example_pdf',
      };

      it('File ???????????? ????????????', async () => {
        const resource = await resourcesService.create(createResourceDto);

        expect(resource.type).toEqual(ResourceType.FILE);
      });
    });

    describe('????????? ???????????? url ???????????????', () => {
      const createResourceDto: CreateResourceDto = {
        contentType: 'plain/text',
        target: 'https://naver.com/news/123',
        name: '?????????',
      };

      it('Url ???????????? ????????????.', async () => {
        const resource = await resourcesService.create(createResourceDto);

        expect(resource.type).toEqual(ResourceType.URL);
      });
    });

    describe('????????? ???????????? document ???????????????', () => {
      const createResourceDto: CreateResourceDto = {
        contentType: 'application/vnd.google-apps.document',
        target: 'https://docs.google.com/1231/3211',
        name: '????????????',
      };

      it('Document ???????????? ????????????.', async () => {
        const resource = await resourcesService.create(createResourceDto);

        expect(resource.type).toEqual(ResourceType.DOCUMENT);
      });
    });
  });

  describe('findAll()', () => {
    beforeEach(async () => {
      const mockUrlResource = {
        name: 'URL?????????',
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
        name: '????????????????',
        metadata: {
          doctype: 'doc',
          creator: '?????????',
          origin: '123_origin',
        },
        type: ResourceType.DOCUMENT,
      };

      await documentsRepository.save(mockDocumentResource);
    });

    describe('????????? type?????? ?????????', () => {
      const queryDto: QueryResourceDto = {};

      it('?????? ???????????? ????????????', async () => {
        const resources = await resourcesService.findAll(queryDto);

        expect(resources.length).toEqual(3);
      });
    });

    describe('????????? type?????? ?????????', () => {
      const queryDto: QueryResourceDto = {
        type: ResourceType.DOCUMENT,
      };

      it('type??? ???????????? ???????????? ????????????', async () => {
        const resources = await resourcesService.findAll(queryDto);

        expect(resources.length).toEqual(1);
        expect(resources[0].type).toEqual(ResourceType.DOCUMENT);
      });
    });
  });

  describe('findOne()', () => {
    beforeEach(async () => {
      const mockUrlResource = {
        name: 'URL?????????',
        metadata: {
          path: 'https://nave.com/news',
        },
        type: ResourceType.URL,
      };

      await urlsRepository.save(mockUrlResource);
    });

    describe('???????????? ????????? ??????', () => {
      it('???????????? ????????????', async () => {
        const result = await resourcesService.findOne(1);

        expect(result.id).toEqual(1);
        expect(() => {}).not.toThrow(NotFoundResourceException);
      });
    });

    describe('???????????? ???????????? ?????? ??????', () => {
      it('NotFoundResourceException ????????? ????????????', async () => {
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
