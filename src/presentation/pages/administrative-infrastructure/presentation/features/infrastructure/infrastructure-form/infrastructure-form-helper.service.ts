import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ADMINISTRATIVE_INFRASTRUCTURE_ROUTE } from '@shared/routes/routes';
import { INFRASTRUCTURE_ROUTE } from '@presentation/pages/administrative-infrastructure/presentation/features/infrastructure/infrastructure-paths.constants';
@Injectable({
    providedIn: 'root',
})
export class InfrastructureFormHelperService {
    private readonly router = inject(Router);

    navigateToInfrastructureList(): void {
        this.router.navigate([
            ADMINISTRATIVE_INFRASTRUCTURE_ROUTE + '/' + INFRASTRUCTURE_ROUTE,
        ]);
    }

    getSweetAlertTitle(isEditMode: boolean): string {
        return isEditMode
            ? 'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE.SWEET_ALERT.TITLE.EDIT'
            : 'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE.SWEET_ALERT.TITLE.CREATE';
    }

    getSweetAlertMessage(isEditMode: boolean): string {
        return isEditMode
            ? 'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE.SWEET_ALERT.MESSAGE.EDIT'
            : 'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE.SWEET_ALERT.MESSAGE.CREATE';
    }
}
