import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { COVERAGE_AREAS_ROUTE } from '@shared/routes/routes';
import { MOBILE_NETWORK_ROUTE } from '@pages/coverage-areas/presentation/features/mobile-network/mobile-network-paths.constants';
@Injectable({
    providedIn: 'root',
})
export class MobileNetworkFormHelperService {
    private readonly router = inject(Router);

    navigateToMobileNetworkList(): void {
        this.router.navigate([
            COVERAGE_AREAS_ROUTE + '/' + MOBILE_NETWORK_ROUTE,
        ]);
    }

    getSweetAlertTitle(isEditMode: boolean): string {
        return isEditMode
            ? 'COVERAGE_AREAS.MOBILE_NETWORK.SWEET_ALERT.TITLE.EDIT'
            : 'COVERAGE_AREAS.MOBILE_NETWORK.SWEET_ALERT.TITLE.CREATE';
    }

    getSweetAlertMessage(isEditMode: boolean): string {
        return isEditMode
            ? 'COVERAGE_AREAS.MOBILE_NETWORK.SWEET_ALERT.MESSAGE.EDIT'
            : 'COVERAGE_AREAS.MOBILE_NETWORK.SWEET_ALERT.MESSAGE.CREATE';
    }
}
