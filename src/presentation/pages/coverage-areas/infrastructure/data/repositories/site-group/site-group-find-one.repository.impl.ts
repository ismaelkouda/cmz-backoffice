import { inject, Injectable } from '@angular/core';
import { SiteGroupFindOneEntity } from '@pages/coverage-areas/domain/entities/site-group/site-group-find-one.entity';
import { SiteGroupFindOneRepository } from '@pages/coverage-areas/domain/repositories/site-group/site-group-find-one.repository';
import { siteGroupFindOneFilterMapper } from '@pages/coverage-areas/infrastructure/data/mappers/site-group/site-group-find-one-filter.mapper';
import { SiteGroupFindOneMapper } from '@pages/coverage-areas/infrastructure/data/mappers/site-group/site-group-find-one.mapper';
import { SiteGroupFindOneApi } from '@pages/coverage-areas/infrastructure/data/sources/site-group/site-group-find-one.api';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { map, Observable } from 'rxjs';
import { SiteGroupFindOneFilterValidateContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-find-one-filter.validate-contract';

@Injectable({ providedIn: 'root' })
export class SiteGroupFindOneRepositoryImpl
    implements SiteGroupFindOneRepository
{
    private readonly api = inject(SiteGroupFindOneApi);
    private readonly mapper = inject(SiteGroupFindOneMapper);

    execute(
        validContract: SiteGroupFindOneFilterValidateContract,
        options?: FetchOptions
    ): Observable<SiteGroupFindOneEntity> {
        const dto = siteGroupFindOneFilterMapper(validContract);
        return this.api
            .execute(dto, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
