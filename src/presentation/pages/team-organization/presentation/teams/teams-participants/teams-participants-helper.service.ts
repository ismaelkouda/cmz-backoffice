import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

import { TEAM_ORGANIZATION_ROUTE } from '@shared/routes/routes';

import { TEAMS_ROUTE } from '@presentation/pages/team-organization/team-organization.routes';

@Injectable({
    providedIn: 'root',
})
export class TeamsParticipantsFormHelperService {
    private readonly router = inject(Router);

    navigateToTeamsList(): void {
        this.router.navigate([TEAM_ORGANIZATION_ROUTE + '/' + TEAMS_ROUTE]);
    }

    getSweetAlertTitle(): string {
        return 'TEAM_ORGANIZATION.TEAMS.PARTICIPANTS.SWEET_ALERT.TITLE_REMOVE';
    }

    getSweetAlertMessage(): string {
        return 'TEAM_ORGANIZATION.TEAMS.PARTICIPANTS.SWEET_ALERT.MESSAGE_REMOVE';
    }
}
