import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DEPARTMENTS_ROUTE } from '@pages/administrative-boundary/administrative-boundary.routes';
import { ADMINISTRATIVE_BOUNDARY_ROUTE } from '@shared/routes/routes';

@Injectable()
export class DepartmentsFormHelperService {
    private readonly router = inject(Router);

    navigateToDepartmentsList(): void {
        this.router.navigate([
            ADMINISTRATIVE_BOUNDARY_ROUTE + '/' + DEPARTMENTS_ROUTE,
        ]);
    }

    getSweetAlertTitle(isEditMode: boolean): string {
        return isEditMode
            ? 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.SWEET_ALERT.TITLE.UPDATE'
            : 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.SWEET_ALERT.TITLE.CREATE';
    }

    getSweetAlertMessage(isEditMode: boolean): string {
        return isEditMode
            ? 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.SWEET_ALERT.MESSAGE.UPDATE'
            : 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.SWEET_ALERT.MESSAGE.CREATE';
    }
}
