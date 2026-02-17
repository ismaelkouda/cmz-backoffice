import { inject, Injectable } from '@angular/core';

import { ArrayBaseFacade } from '@shared/application/services/array-base-facade';
import { shouldFetch } from '@shared/application/services/facade.utils';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';

import { ResponsibilitiesSelectUseCase } from '@presentation/pages/settings-security/core/application/use-cases/users/responsibilities-select.use-case';
import { ResponsibilitiesSelectEntity } from '@presentation/pages/settings-security/core/domain/entities/users/responsibilities-select.entity';

@Injectable({
    providedIn: 'root',
})
export class ResponsibilitiesSelectFacade extends ArrayBaseFacade<
    ResponsibilitiesSelectEntity,
    void
> {
    private readonly uiFeedbackService = inject(UiFeedbackService);
    private readonly useCase = inject(ResponsibilitiesSelectUseCase);

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
