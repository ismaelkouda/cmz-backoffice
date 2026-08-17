import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NEWS_ROUTE } from '@pages/content-management/content-management.routes';
import { CONTENT_MANAGEMENT_ROUTE } from '@shared/routes/routes';

@Injectable()
export class NewsFormHelperService {
    private readonly router = inject(Router);

    navigateToNewsList(): void {
        this.router.navigate([CONTENT_MANAGEMENT_ROUTE + '/' + NEWS_ROUTE]);
    }

    getSweetAlertTitle(isEditMode: boolean): string {
        return isEditMode
            ? 'CONTENT_MANAGEMENT.NEWS.SWEET_ALERT.TITLE.EDIT'
            : 'CONTENT_MANAGEMENT.NEWS.SWEET_ALERT.TITLE.CREATE';
    }

    getSweetAlertMessage(isEditMode: boolean): string {
        return isEditMode
            ? 'CONTENT_MANAGEMENT.NEWS.SWEET_ALERT.MESSAGE.EDIT'
            : 'CONTENT_MANAGEMENT.NEWS.SWEET_ALERT.MESSAGE.CREATE';
    }
}
