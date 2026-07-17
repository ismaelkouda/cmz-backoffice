import { RegionsFindOneFilterValidateContract } from '@presentation/pages/administrative-boundary/domain/contracts/regions/regions-find-one-filter.validate-contract';
import { RegionsFindOneEntity } from '@pages/administrative-boundary/domain/entities/regions/regions-find-one.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

export abstract class RegionsFindOneRepository {
    abstract execute(
        filter: RegionsFindOneFilterValidateContract,
        options?: FetchOptions
    ): Observable<RegionsFindOneEntity>;
}
