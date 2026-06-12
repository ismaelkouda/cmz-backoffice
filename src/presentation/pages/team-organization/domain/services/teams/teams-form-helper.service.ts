import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TEAMS_ROUTE } from '@pages/team-organization/team-organization.routes';
import { TEAM_ORGANIZATION_ROUTE } from '@shared/routes/routes';

@Injectable({ providedIn: 'root' })
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
            ? 'TEAM_ORGANIZATION.TEAMS.SWEET_ALERT.MESSAGE.EDIT'
            : 'TEAM_ORGANIZATION.TEAMS.SWEET_ALERT.MESSAGE.CREATE';
    }
}
