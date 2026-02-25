import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

import { ADMINISTRATIVE_BOUNDARY_ROUTE } from '@shared/routes/routes';

import { DEPARTMENTS_ROUTE } from '@presentation/pages/administrative-boundary/administrative-boundary.routes';

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
            ? 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.SWEET_ALERT.TITLE_UPDATE'
            : 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.SWEET_ALERT.TITLE_CREATE';
    }

    getSweetAlertMessage(isEditMode: boolean): string {
        return isEditMode
            ? 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.SWEET_ALERT.MESSAGE_UPDATE'
            : 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.SWEET_ALERT.MESSAGE_CREATE';
    }
}
