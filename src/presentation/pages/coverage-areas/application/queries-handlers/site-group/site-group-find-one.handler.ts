import { Injectable, inject } from '@angular/core';
import { siteGroupFindOneQueryMapper } from '@pages/coverage-areas/application/queries-mappers/site-group/site-group-find-one.mapper';
import { SiteGroupFindOneQuery } from '@pages/coverage-areas/application/queries/site-group/site-group-find-one.query';
import { SiteGroupFindOneUseCase } from '@pages/coverage-areas/application/use-cases/site-group/site-group-find-one.use-case';
import { SiteGroupFindOneEntity } from '@pages/coverage-areas/domain/entities/site-group/site-group-find-one.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SiteGroupFindOneHandler {
    private readonly useCase = inject(SiteGroupFindOneUseCase);

    execute(
        command: SiteGroupFindOneQuery,
        options?: FetchOptions
    ): Observable<SiteGroupFindOneEntity> {
        return this.useCase.execute(
            siteGroupFindOneQueryMapper(command),
            options
        );
    }
}
