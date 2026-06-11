import { inject, Injectable } from '@angular/core';
import { TeamsPermissionsBus } from '@pages/team-organization/application/queries-bus/teams/teams-permissions.bus';
import { TeamsPermissionsEntity } from '@pages/team-organization/domain/entities/teams/teams-permissions.entity';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class TeamsPermissionsFacade extends ObjectBaseFacade<
    TeamsPermissionsEntity,
    null
> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(TeamsPermissionsBus);

    readAll(options: FetchOptions = {}): void {
        const fetch$ = this.bus.dispatch(options);
        this.fetch(null, fetch$, this.ui);
    }
}
