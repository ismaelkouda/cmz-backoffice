import { SiteGroupFindOneFilterValidateContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-find-one-filter.validate-contract';
import { SiteGroupFindOneEntity } from '@pages/coverage-areas/domain/entities/site-group/site-group-find-one.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

export abstract class SiteGroupFindOneRepository {
    abstract execute(
        filter: SiteGroupFindOneFilterValidateContract,
        options?: FetchOptions
    ): Observable<SiteGroupFindOneEntity>;
}
