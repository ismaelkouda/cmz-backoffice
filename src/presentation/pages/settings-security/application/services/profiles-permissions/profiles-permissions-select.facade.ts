import { inject, Injectable } from '@angular/core';

import { ArrayBaseFacade } from '@shared/application/services/array-base-facade';
import { shouldFetch } from '@shared/application/services/facade.utils';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';

import { ProfilesPermissionsSelectUseCase } from '@presentation/pages/settings-security/application/use-cases/profiles-permissions/profiles-permissions-select.use-case';
import { ProfilesPermissionsSelectEntity } from '@presentation/pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-select.entity';

@Injectable({
    providedIn: 'root',
})
export class ProfilesPermissionsSelectFacade extends ArrayBaseFacade<
    ProfilesPermissionsSelectEntity,
    void
> {
    private readonly uiFeedbackService = inject(UiFeedbackService);
    private readonly useCase = inject(ProfilesPermissionsSelectUseCase);

    readonly items = this.items$;

    private hasInitialized = false;
    private lastFetchTimestamp = 0;
    private readonly STALE_TIME = 2 * 60 * 1000;

    readAll(forceRefresh = false): void {
        const hasData = this.itemsSubject.getValue().length > 0;
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

        this.fetchWithFilter(
            null,
            this.useCase.readAll.bind(this.useCase),
            this.uiFeedbackService
        );

        this.hasInitialized = true;
        this.lastFetchTimestamp = Date.now();
    }
}
