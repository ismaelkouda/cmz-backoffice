import { MunicipalitiesSelectEntity } from '@pages/administrative-boundary/domain/entities/municipalities/municipalities-select.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

export abstract class MunicipalitiesSelectRepository {
    abstract execute(
        options?: FetchOptions
    ): Observable<MunicipalitiesSelectEntity[]>;
}
