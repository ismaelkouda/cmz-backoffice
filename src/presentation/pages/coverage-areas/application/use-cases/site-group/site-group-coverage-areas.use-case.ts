import { inject, Injectable } from '@angular/core';
import { SiteGroupCoverageAreasRepository } from '@pages/coverage-areas/domain/repositories/site-group/site-group-coverage-areas.repository';
import { SiteGroupCoverageAreaIds } from '@pages/coverage-areas/domain/interfaces/site-group/site-group-coverage-area-ids.interface';
import { SiteGroupCoverageAreaReassign } from '@pages/coverage-areas/domain/interfaces/site-group/site-group-coverage-area-reassign.interface';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { defer } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SiteGroupCoverageAreasUseCase {
    private readonly repository = inject(SiteGroupCoverageAreasRepository);

    read(siteGroupId: number, options?: FetchOptions) {
        return defer(() => this.repository.read(siteGroupId, options));
    }

    readUnassigned(options?: FetchOptions) {
        return defer(() => this.repository.readUnassigned(options));
    }

    assign(siteGroupId: number, dto: SiteGroupCoverageAreaIds) {
        return defer(() => this.repository.assign(siteGroupId, dto));
    }

    reassign(targetSiteGroupId: number, dto: SiteGroupCoverageAreaReassign) {
        return defer(() => this.repository.reassign(targetSiteGroupId, dto));
    }

    remove(siteGroupId: number, dto: SiteGroupCoverageAreaIds) {
        return defer(() => this.repository.remove(siteGroupId, dto));
    }
}
