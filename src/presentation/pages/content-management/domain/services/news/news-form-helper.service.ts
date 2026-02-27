import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

import { TEAM_ORGANIZATION_ROUTE } from '@shared/routes/routes';

import { PARTICIPANTS_ROUTE } from '@presentation/pages/team-organization/team-organization.routes';

@Injectable()
export class NewsFormHelperService {
    private readonly router = inject(Router);

    navigateToNewsList(): void {
        this.router.navigate([
            TEAM_ORGANIZATION_ROUTE + '/' + PARTICIPANTS_ROUTE,
        ]);
    }

    getSweetAlertTitle(isEditMode: boolean): string {
        return isEditMode
            ? 'TEAM_ORGANIZATION.PARTICIPANTS.SWEET_ALERT.TITLE_UPDATE'
            : 'TEAM_ORGANIZATION.PARTICIPANTS.SWEET_ALERT.TITLE_CREATE';
    }

    getSweetAlertMessage(isEditMode: boolean): string {
        return isEditMode
            ? 'TEAM_ORGANIZATION.PARTICIPANTS.SWEET_ALERT.MESSAGE_UPDATE'
            : 'TEAM_ORGANIZATION.PARTICIPANTS.SWEET_ALERT.MESSAGE_CREATE';
    }
}
