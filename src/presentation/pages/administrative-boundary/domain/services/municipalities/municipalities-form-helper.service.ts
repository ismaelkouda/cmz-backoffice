import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MUNICIPALITIES_ROUTE } from '@pages/administrative-boundary/administrative-boundary.routes';
import { ADMINISTRATIVE_BOUNDARY_ROUTE } from '@shared/routes/routes';

@Injectable()
export class MunicipalitiesFormHelperService {
    private readonly router = inject(Router);

    navigateToMunicipalitiesList(): void {
        this.router.navigate([
            ADMINISTRATIVE_BOUNDARY_ROUTE + '/' + MUNICIPALITIES_ROUTE,
        ]);
    }

    getSweetAlertTitle(isEditMode: boolean): string {
        return isEditMode
            ? 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.SWEET_ALERT.TITLE_UPDATE'
            : 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.SWEET_ALERT.TITLE_CREATE';
    }

    getSweetAlertMessage(isEditMode: boolean): string {
        return isEditMode
            ? 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.SWEET_ALERT.MESSAGE_UPDATE'
            : 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.SWEET_ALERT.MESSAGE_CREATE';
    }
}
