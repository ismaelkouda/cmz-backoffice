import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SLIDE_ROUTE } from '@pages/content-management/content-management.routes';
import { CONTENT_MANAGEMENT_ROUTE } from '@shared/routes/routes';

@Injectable()
export class SlideFormHelperService {
    private readonly router = inject(Router);

    navigateToSlideList(): void {
        this.router.navigate([CONTENT_MANAGEMENT_ROUTE + '/' + SLIDE_ROUTE]);
    }

    getSweetAlertTitle(isEditMode: boolean): string {
        return isEditMode
            ? 'CONTENT_MANAGEMENT.SLIDE.SWEET_ALERT.TITLE_UPDATE'
            : 'CONTENT_MANAGEMENT.SLIDE.SWEET_ALERT.TITLE_CREATE';
    }

    getSweetAlertMessage(isEditMode: boolean): string {
        return isEditMode
            ? 'CONTENT_MANAGEMENT.SLIDE.SWEET_ALERT.MESSAGE_UPDATE'
            : 'CONTENT_MANAGEMENT.SLIDE.SWEET_ALERT.MESSAGE_CREATE';
    }
}
