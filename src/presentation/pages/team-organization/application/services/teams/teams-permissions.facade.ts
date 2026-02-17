import { inject, Injectable } from '@angular/core';

import { shouldFetch } from '@shared/application/services/facade.utils';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';

import { TeamsPermissionsBus } from '@presentation/pages/team-organization/application/queries-bus/teams/teams-permissions.bus';
import { TeamsPermissionsEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-permissions.entity';

@Injectable({
    providedIn: 'root',
})
export class TeamsPermissionsFacade extends ObjectBaseFacade<
    TeamsPermissionsEntity,
    null
> {
    private readonly uiFeedbackService = inject(UiFeedbackService);
    private readonly bus = inject(TeamsPermissionsBus);

    readonly items = this.items$;

    private hasInitialized = false;
    private lastFetchTimestamp = 0;
    private readonly STALE_TIME = 2 * 60 * 1000;

    readAll(forceRefresh = false): void {
        const hasData = this.itemsSubject.getValue() !== null;
        if (
            !shouldFetch(
                forceRefresh,
                hasData,
                this.lastFetchTimestamp,
                this.STALE_TIME
            )
        ) {
            return;
        }
        const fetch$ = this.bus.dispatch();
        this.fetchWithFilter(null, fetch$, this.uiFeedbackService);

        this.hasInitialized = true;
        this.lastFetchTimestamp = Date.now();
    }
}
