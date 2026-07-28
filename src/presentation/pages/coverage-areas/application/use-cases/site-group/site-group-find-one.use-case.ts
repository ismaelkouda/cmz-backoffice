import { inject } from '@angular/core';
import { SiteGroupFindOneFilterContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-find-one-filter.contract';
import { SiteGroupFindOneEntity } from '@pages/coverage-areas/domain/entities/site-group/site-group-find-one.entity';
import { SiteGroupFindOneRepository } from '@pages/coverage-areas/domain/repositories/site-group/site-group-find-one.repository';
import { siteGroupFindOneFilterVo } from '@pages/coverage-areas/domain/value-objects/site-group/site-group-find-one-filter.vo';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { defer, Observable } from 'rxjs';

export class SiteGroupFindOneUseCase {
    private readonly repository = inject(SiteGroupFindOneRepository);

    execute(
        contract: SiteGroupFindOneFilterContract,
        options?: FetchOptions
    ): Observable<SiteGroupFindOneEntity> {
        return defer(() =>
            this.repository.execute(siteGroupFindOneFilterVo(contract), options)
        );
    }
}
