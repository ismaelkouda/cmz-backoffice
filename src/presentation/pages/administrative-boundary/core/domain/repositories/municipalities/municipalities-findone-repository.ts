import { Observable } from 'rxjs';
import { MunicipalitiesFindoneEntity } from '../../entities/municipalities/municipalities-findone.entity';
import { MunicipalitiesFindoneFilter } from '../../value-objects/municipalities/municipalities-findone-filter.vo';

export abstract class MunicipalitiesFindoneRepository {
    abstract read(
        filter: MunicipalitiesFindoneFilter | null,
    ): Observable<MunicipalitiesFindoneEntity>;
}
