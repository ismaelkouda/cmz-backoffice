import { Observable } from 'rxjs';

import { MunicipalitiesSelectEntity } from '@presentation/pages/administrative-boundary/domain/entities/municipalities/municipalities-select.entity';

export abstract class MunicipalitiesSelectRepository {
    abstract execute(): Observable<MunicipalitiesSelectEntity[]>;
}
