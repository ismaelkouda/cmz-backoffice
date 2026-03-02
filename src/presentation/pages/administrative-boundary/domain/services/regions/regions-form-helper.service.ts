import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

import { ADMINISTRATIVE_BOUNDARY_ROUTE } from '@shared/routes/routes';

import { REGIONS_ROUTE } from '@presentation/pages/administrative-boundary/administrative-boundary.routes';

@Injectable()
export class RegionsFormHelperService {
    private readonly router = inject(Router);

    navigateToRegionsList(): void {
        this.router.navigate([
            ADMINISTRATIVE_BOUNDARY_ROUTE + '/' + REGIONS_ROUTE,
        ]);
    }

    getSweetAlertTitle(isEditMode: boolean): string {
        return isEditMode
            ? 'ADMINISTRATIVE_BOUNDARY.REGIONS.SWEET_ALERT.TITLE_UPDATE'
            : 'ADMINISTRATIVE_BOUNDARY.REGIONS.SWEET_ALERT.TITLE_CREATE';
    }

    getSweetAlertMessage(isEditMode: boolean): string {
        return isEditMode
            ? 'ADMINISTRATIVE_BOUNDARY.REGIONS.SWEET_ALERT.MESSAGE_UPDATE'
            : 'ADMINISTRATIVE_BOUNDARY.REGIONS.SWEET_ALERT.MESSAGE_CREATE';
    }
}
