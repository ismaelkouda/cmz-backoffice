import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

import { CONTENT_MANAGEMENT_ROUTE } from '@shared/routes/routes';

import { HOME_ROUTE } from '@presentation/pages/content-management/content-management.routes';

@Injectable()
export class HomeFormHelperService {
    private readonly router = inject(Router);

    navigateToHomeList(): void {
        this.router.navigate([CONTENT_MANAGEMENT_ROUTE + '/' + HOME_ROUTE]);
    }

    getSweetAlertTitle(isEditMode: boolean): string {
        return isEditMode
            ? 'CONTENT_MANAGEMENT.HOME.SWEET_ALERT.TITLE_UPDATE'
            : 'CONTENT_MANAGEMENT.HOME.SWEET_ALERT.TITLE_CREATE';
    }

    getSweetAlertMessage(isEditMode: boolean): string {
        return isEditMode
            ? 'CONTENT_MANAGEMENT.HOME.SWEET_ALERT.MESSAGE_UPDATE'
            : 'CONTENT_MANAGEMENT.HOME.SWEET_ALERT.MESSAGE_CREATE';
    }
}
