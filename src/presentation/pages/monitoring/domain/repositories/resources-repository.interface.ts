import { Observable } from 'rxjs';

import { ResourcesEntity } from '../entities/resources/resources.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

export abstract class ResourcesRepository {
    abstract fetchResources(
        options?: FetchOptions
    ): Observable<ResourcesEntity>;
}
