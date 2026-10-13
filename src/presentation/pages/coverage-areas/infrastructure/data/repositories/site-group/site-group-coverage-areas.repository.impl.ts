import { Injectable, inject } from '@angular/core';
import { SiteGroupCoverageAreasRepository } from '@pages/coverage-areas/domain/repositories/site-group/site-group-coverage-areas.repository';
import { SiteGroupCoverageAreasApi } from '@pages/coverage-areas/infrastructure/data/sources/site-group/site-group-coverage-areas.api';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { map } from 'rxjs';
import { SiteGroupCoverageAreasEntity } from '@pages/coverage-areas/domain/entities/site-group/site-group-coverage-areas.entity';
import { SiteGroupCoverageAreaEntity } from '@pages/coverage-areas/domain/entities/site-group/site-group-coverage-area.entity';
import { SiteGroupCoverageAreaSelectionEntity } from '@pages/coverage-areas/domain/entities/site-group/site-group-coverage-area-selection.entity';
import { SiteGroupCoverageAreaIds } from '@pages/coverage-areas/domain/interfaces/site-group/site-group-coverage-area-ids.interface';
import { SiteGroupCoverageAreaReassign } from '@pages/coverage-areas/domain/interfaces/site-group/site-group-coverage-area-reassign.interface';

@Injectable({ providedIn: 'root' })
export class SiteGroupCoverageAreasRepositoryImpl extends SiteGroupCoverageAreasRepository {
    private readonly api = inject(SiteGroupCoverageAreasApi);

    read(siteGroupId: number, options?: FetchOptions) {
        return this.api.read(siteGroupId, options).pipe(
            map(
                (response) =>
                    new SiteGroupCoverageAreasEntity({
                        coverageAreas: (
                            response.data?.coverage_areas ?? []
                        ).map((item) => new SiteGroupCoverageAreaEntity(item)),
                    })
            )
        );
    }

    readUnassigned(options?: FetchOptions) {
        return this.api
            .readUnassigned(options)
            .pipe(
                map((response) =>
                    (response.data ?? []).map(
                        (item) =>
                            new SiteGroupCoverageAreaSelectionEntity(
                                item.id,
                                item.site_name
                            )
                    )
                )
            );
    }

    assign(siteGroupId: number, dto: SiteGroupCoverageAreaIds) {
        return this.api.assign(siteGroupId, dto);
    }

    reassign(targetSiteGroupId: number, dto: SiteGroupCoverageAreaReassign) {
        return this.api.reassign(targetSiteGroupId, dto);
    }

    remove(siteGroupId: number, dto: SiteGroupCoverageAreaIds) {
        return this.api.remove(siteGroupId, dto);
    }
}
