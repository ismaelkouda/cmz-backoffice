import { Observable } from 'rxjs';

import { MunicipalitiesFindOneFilterEntity } from '@presentation/pages/administrative-boundary/domain/entities/municipalities/municipalities-find-one-filter.entity';
import { MunicipalitiesFindOneEntity } from '@presentation/pages/administrative-boundary/domain/entities/municipalities/municipalities-find-one.entity';

export abstract class MunicipalitiesFindOneRepository {
    abstract execute(
        filter: MunicipalitiesFindOneFilterEntity
    ): Observable<MunicipalitiesFindOneEntity>;
}
