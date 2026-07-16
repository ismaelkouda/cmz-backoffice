import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ADMINISTRATIVE_INFRASTRUCTURE_ROUTE } from '@shared/routes/routes';
import { INFRASTRUCTURE_TYPE_ROUTE } from '@presentation/pages/administrative-infrastructure/presentation/features/infrastructure-type/infrastructure-type-paths.constants';
@Injectable({
    providedIn: 'root',
})
export class InfrastructureTypeFormHelperService {
    private readonly router = inject(Router);

    navigateToInfrastructureTypeList(): void {
        this.router.navigate([
            ADMINISTRATIVE_INFRASTRUCTURE_ROUTE +
                '/' +
                INFRASTRUCTURE_TYPE_ROUTE,
        ]);
    }

    getSweetAlertTitle(isEditMode: boolean): string {
        return isEditMode
            ? 'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE_TYPE.SWEET_ALERT.TITLE.EDIT'
            : 'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE_TYPE.SWEET_ALERT.TITLE.CREATE';
    }

    getSweetAlertMessage(isEditMode: boolean): string {
        return isEditMode
            ? 'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE_TYPE.SWEET_ALERT.MESSAGE.EDIT'
            : 'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE_TYPE.SWEET_ALERT.MESSAGE.CREATE';
    }
}
