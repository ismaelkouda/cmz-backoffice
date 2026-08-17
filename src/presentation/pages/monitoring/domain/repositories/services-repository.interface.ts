import { Observable } from 'rxjs';

import { ServicesEntity } from '../entities/services/services.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

export abstract class ServicesRepository {
    abstract fetchServices(options?: FetchOptions): Observable<ServicesEntity>;
}
