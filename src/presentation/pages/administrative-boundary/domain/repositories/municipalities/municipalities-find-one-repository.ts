import { MunicipalitiesFindOneFilterEntity } from '@pages/administrative-boundary/domain/entities/municipalities/municipalities-find-one-filter.entity';
import { MunicipalitiesFindOneEntity } from '@pages/administrative-boundary/domain/entities/municipalities/municipalities-find-one.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

export abstract class MunicipalitiesFindOneRepository {
    abstract execute(
        filter: MunicipalitiesFindOneFilterEntity,
        options?: FetchOptions
    ): Observable<MunicipalitiesFindOneEntity>;
}
