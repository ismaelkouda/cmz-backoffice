import { MunicipalitiesSelectEntity } from '@pages/administrative-boundary/domain/entities/municipalities/municipalities-select.entity';
import { Observable } from 'rxjs';

export abstract class MunicipalitiesSelectRepository {
    abstract execute(): Observable<MunicipalitiesSelectEntity[]>;
}
