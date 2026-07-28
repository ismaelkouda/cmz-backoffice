import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { COVERAGE_AREAS_ROUTE } from '@shared/routes/routes';
import { OPTICAL_FIBER_NETWORK_ROUTE } from '@pages/coverage-areas/presentation/features/optical-fiber-network/optical-fiber-network-paths.constants';

@Injectable({
    providedIn: 'root',
})
export class OpticalFiberNetworkFormHelperService {
    private readonly router = inject(Router);

    navigateToOpticalFiberNetworkList(): void {
        this.router.navigate([
            COVERAGE_AREAS_ROUTE + '/' + OPTICAL_FIBER_NETWORK_ROUTE,
        ]);
    }

    getSweetAlertTitle(isEditMode: boolean): string {
        return isEditMode
            ? 'COVERAGE_AREAS.OPTICAL_FIBER_NETWORK.SWEET_ALERT.TITLE.EDIT'
            : 'COVERAGE_AREAS.OPTICAL_FIBER_NETWORK.SWEET_ALERT.TITLE.CREATE';
    }

    getSweetAlertMessage(isEditMode: boolean): string {
        return isEditMode
            ? 'COVERAGE_AREAS.OPTICAL_FIBER_NETWORK.SWEET_ALERT.MESSAGE.EDIT'
            : 'COVERAGE_AREAS.OPTICAL_FIBER_NETWORK.SWEET_ALERT.MESSAGE.CREATE';
    }
}
