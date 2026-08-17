import { inject, Injectable } from '@angular/core';
import { ResponsibilitiesSelectUseCase } from '@pages/settings-security/application/use-cases/users/responsibilities-select.use-case';
import { ResponsibilitiesSelectEntity } from '@pages/settings-security/domain/entities/users/responsibilities-select.entity';
import { ArrayBaseFacade } from '@shared/application/services/array-base-facade';

import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class ResponsibilitiesSelectFacade extends ArrayBaseFacade<
    ResponsibilitiesSelectEntity,
    void
> {
    private readonly uiFeedback = inject(UiFeedbackService);
    private readonly useCase = inject(ResponsibilitiesSelectUseCase);

    readonly items = this.items$;

    private hasInitialized = false;
    private lastFetchTimestamp = 0;

    readAll(options: FetchOptions = {}): void {
        this.fetchWithFilter(
            null,
            this.useCase.readAll.bind(this.useCase, options),
            this.uiFeedback
        );

        this.hasInitialized = true;
        this.lastFetchTimestamp = Date.now();
    }
}
