import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LEGAL_NOTICE_ROUTE } from '@pages/content-management/content-management.routes';
import { CONTENT_MANAGEMENT_ROUTE } from '@shared/routes/routes';

@Injectable()
export class LegalNoticeFormHelperService {
    private readonly router = inject(Router);

    navigateToLegalNoticeList(): void {
        this.router.navigate([
            CONTENT_MANAGEMENT_ROUTE + '/' + LEGAL_NOTICE_ROUTE,
        ]);
    }

    getSweetAlertTitle(isEditMode: boolean): string {
        return isEditMode
            ? 'CONTENT_MANAGEMENT.LEGAL_NOTICE.SWEET_ALERT.TITLE.EDIT'
            : 'CONTENT_MANAGEMENT.LEGAL_NOTICE.SWEET_ALERT.TITLE.CREATE';
    }

    getSweetAlertMessage(isEditMode: boolean): string {
        return isEditMode
            ? 'CONTENT_MANAGEMENT.LEGAL_NOTICE.SWEET_ALERT.MESSAGE.EDIT'
            : 'CONTENT_MANAGEMENT.LEGAL_NOTICE.SWEET_ALERT.MESSAGE.CREATE';
    }
}
