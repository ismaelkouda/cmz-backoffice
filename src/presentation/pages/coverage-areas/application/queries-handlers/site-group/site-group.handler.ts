import { Injectable, inject } from '@angular/core';
import { siteGroupQueryMapper } from '@pages/coverage-areas/application/queries-mappers/site-group/site-group.mapper';
import { SiteGroupQuery } from '@pages/coverage-areas/application/queries/site-group/site-group.query';
import { SiteGroupUseCase } from '@pages/coverage-areas/application/use-cases/site-group/site-group.use-case';
import { SiteGroupEntity } from '@pages/coverage-areas/domain/entities/site-group/site-group.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SiteGroupHandler {
    private readonly useCase = inject(SiteGroupUseCase);

    execute(
        command: SiteGroupQuery,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<SiteGroupEntity>> {
        return this.useCase.execute(
            siteGroupQueryMapper(command),
            page,
            options
        );
    }
}
