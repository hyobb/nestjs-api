import { EntityRepository, Repository } from 'typeorm';
import { Resource } from './entities/resource.entity';

@EntityRepository(Resource)
export class ResourcesRepository extends Repository<Resource> {}
