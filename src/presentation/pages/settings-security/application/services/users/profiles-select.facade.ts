import { inject, Injectable } from '@angular/core';

import { ArrayBaseFacade } from '@shared/application/services/array-base-facade';
import { shouldFetch } from '@shared/application/services/facade.utils';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';

import { ProfilesSelectUseCase } from '@presentation/pages/settings-security/application/use-cases/users/profiles-select.use-case';
import { ProfilesSelectEntity } from '@presentation/pages/settings-security/domain/entities/users/profiles-select.entity';

@Injectable({
    providedIn: 'root',
})
export class ProfilesSelectFacade extends ArrayBaseFacade<
    ProfilesSelectEntity,
    void
> {
    private readonly uiFeedbackService = inject(UiFeedbackService);
    private readonly useCase = inject(ProfilesSelectUseCase);

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
