import { EntityRepository, Repository } from 'typeorm';
import { Url } from './entities/url.entity';

@EntityRepository(Url)
export class UrlsRepository extends Repository<Url> {}
