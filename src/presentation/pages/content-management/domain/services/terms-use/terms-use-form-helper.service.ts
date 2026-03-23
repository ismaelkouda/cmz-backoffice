import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TERMS_USE_ROUTE } from '@pages/content-management/content-management.routes';
import { CONTENT_MANAGEMENT_ROUTE } from '@shared/routes/routes';

@Injectable()
export class TermsUseFormHelperService {
    private readonly router = inject(Router);

    navigateToTermsUseList(): void {
        this.router.navigate([
            CONTENT_MANAGEMENT_ROUTE + '/' + TERMS_USE_ROUTE,
        ]);
    }

    getSweetAlertTitle(isEditMode: boolean): string {
        return isEditMode
            ? 'CONTENT_MANAGEMENT.TERMS_USE.SWEET_ALERT.TITLE_UPDATE'
            : 'CONTENT_MANAGEMENT.TERMS_USE.SWEET_ALERT.TITLE_CREATE';
    }

    getSweetAlertMessage(isEditMode: boolean): string {
        return isEditMode
            ? 'CONTENT_MANAGEMENT.TERMS_USE.SWEET_ALERT.MESSAGE_UPDATE'
            : 'CONTENT_MANAGEMENT.TERMS_USE.SWEET_ALERT.MESSAGE_CREATE';
    }
}
