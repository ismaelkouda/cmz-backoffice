import { Observable } from 'rxjs';

import { ServicesEntity } from '../entities/services/services.entity';

export abstract class ServicesRepository {
    abstract fetchServices(): Observable<ServicesEntity>;
}
