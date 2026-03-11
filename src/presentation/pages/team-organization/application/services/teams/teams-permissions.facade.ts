import { inject, Injectable } from '@angular/core';
import { TeamsPermissionsBus } from '@pages/team-organization/application/queries-bus/teams/teams-permissions.bus';
import { TeamsPermissionsEntity } from '@pages/team-organization/domain/entities/teams/teams-permissions.entity';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';

@Injectable({
    providedIn: 'root',
})
export class TeamsPermissionsFacade extends ObjectBaseFacade<
    TeamsPermissionsEntity,
    null
> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(TeamsPermissionsBus);

    private readonly STALE_TIME = 2 * 60 * 1000;

    readAll(force = false): void {
        const fetch$ = this.bus.dispatch();
        this.fetch(null, fetch$, this.ui, this.STALE_TIME, force);
    }
}
