import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

import { TEAM_ORGANIZATION_ROUTE } from '@shared/routes/routes';

import { TEAMS_ROUTE } from '@presentation/pages/team-organization/team-organization.routes';

@Injectable({
    providedIn: 'root',
})
export class TeamsFormHelperService {
    private readonly router = inject(Router);

    navigateToTeamsList(): void {
        this.router.navigate([TEAM_ORGANIZATION_ROUTE + '/' + TEAMS_ROUTE]);
    }

    getSweetAlertTitle(isEditMode: boolean): string {
        return isEditMode
            ? 'TEAM_ORGANIZATION.TEAMS.SWEET_ALERT.TITLE_UPDATE'
            : 'TEAM_ORGANIZATION.TEAMS.SWEET_ALERT.TITLE_CREATE';
    }

    getSweetAlertMessage(isEditMode: boolean): string {
        return isEditMode
            ? 'TEAM_ORGANIZATION.TEAMS.SWEET_ALERT.MESSAGE_UPDATE'
            : 'TEAM_ORGANIZATION.TEAMS.SWEET_ALERT.MESSAGE_CREATE';
    }
}
