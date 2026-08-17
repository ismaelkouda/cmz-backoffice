import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { COVERAGE_AREAS_ROUTE } from '@shared/routes/routes';
import { SITE_GROUP_ROUTE } from '@pages/coverage-areas/presentation/features/site-group/site-group-paths.constants';
@Injectable({
    providedIn: 'root',
})
export class SiteGroupFormHelperService {
    private readonly router = inject(Router);

    navigateToSiteGroupList(): void {
        this.router.navigate([COVERAGE_AREAS_ROUTE + '/' + SITE_GROUP_ROUTE]);
    }

    getSweetAlertTitle(isEditMode: boolean): string {
        return isEditMode
            ? 'COVERAGE_AREAS.SITE_GROUP.SWEET_ALERT.TITLE.EDIT'
            : 'COVERAGE_AREAS.SITE_GROUP.SWEET_ALERT.TITLE.CREATE';
    }

    getSweetAlertMessage(isEditMode: boolean): string {
        return isEditMode
            ? 'COVERAGE_AREAS.SITE_GROUP.SWEET_ALERT.MESSAGE.EDIT'
            : 'COVERAGE_AREAS.SITE_GROUP.SWEET_ALERT.MESSAGE.CREATE';
    }
}
