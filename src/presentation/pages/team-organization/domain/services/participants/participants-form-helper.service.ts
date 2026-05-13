import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PARTICIPANTS_ROUTE } from '@pages/team-organization/team-organization.routes';
import { TEAM_ORGANIZATION_ROUTE } from '@shared/routes/routes';

@Injectable()
export class ParticipantsFormHelperService {
    private readonly router = inject(Router);

    navigateToParticipantsList(): void {
        this.router.navigate([
            TEAM_ORGANIZATION_ROUTE + '/' + PARTICIPANTS_ROUTE,
        ]);
    }

    getSweetAlertTitle(isEditMode: boolean): string {
        return isEditMode
            ? 'TEAM_ORGANIZATION.PARTICIPANTS.SWEET_ALERT.TITLE.UPDATE'
            : 'TEAM_ORGANIZATION.PARTICIPANTS.SWEET_ALERT.TITLE.CREATE';
    }

    getSweetAlertMessage(isEditMode: boolean): string {
        return isEditMode
            ? 'TEAM_ORGANIZATION.PARTICIPANTS.SWEET_ALERT.MESSAGE.UPDATE'
            : 'TEAM_ORGANIZATION.PARTICIPANTS.SWEET_ALERT.MESSAGE.CREATE';
    }
}
