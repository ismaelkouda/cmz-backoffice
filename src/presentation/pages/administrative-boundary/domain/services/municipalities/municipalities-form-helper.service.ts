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
            ? 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.SWEET_ALERT.TITLE.EDIT'
            : 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.SWEET_ALERT.TITLE.CREATE';
    }

    getSweetAlertMessage(isEditMode: boolean): string {
        return isEditMode
            ? 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.SWEET_ALERT.MESSAGE.EDIT'
            : 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.SWEET_ALERT.MESSAGE.CREATE';
    }
}
