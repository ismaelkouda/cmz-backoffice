import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PRIVACY_POLICY_ROUTE } from '@pages/content-management/content-management.routes';
import { CONTENT_MANAGEMENT_ROUTE } from '@shared/routes/routes';

@Injectable()
export class PrivacyPolicyFormHelperService {
    private readonly router = inject(Router);

    navigateToPrivacyPolicyList(): void {
        this.router.navigate([
            CONTENT_MANAGEMENT_ROUTE + '/' + PRIVACY_POLICY_ROUTE,
        ]);
    }

    getSweetAlertTitle(isEditMode: boolean): string {
        return isEditMode
            ? 'CONTENT_MANAGEMENT.PRIVACY_POLICY.SWEET_ALERT.TITLE.UPDATE'
            : 'CONTENT_MANAGEMENT.PRIVACY_POLICY.SWEET_ALERT.TITLE.CREATE';
    }

    getSweetAlertMessage(isEditMode: boolean): string {
        return isEditMode
            ? 'CONTENT_MANAGEMENT.PRIVACY_POLICY.SWEET_ALERT.MESSAGE.UPDATE'
            : 'CONTENT_MANAGEMENT.PRIVACY_POLICY.SWEET_ALERT.MESSAGE.CREATE';
    }
}
