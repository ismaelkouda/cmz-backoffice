import { Observable } from 'rxjs';

import { ResourcesEntity } from '../entities/resources/resources.entity';

export abstract class ResourcesRepository {
    abstract fetchResources(): Observable<ResourcesEntity>;
}
