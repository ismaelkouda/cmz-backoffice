import { inject, Injectable } from '@angular/core';
import { RegionsSelectUseCase } from '@pages/administrative-boundary/application/use-cases/regions/regions-select.use-case';
import { RegionsSelectEntity } from '@pages/administrative-boundary/domain/entities/regions/regions-select.entity';
import { ArrayBaseFacade } from '@shared/application/services/array-base-facade';

import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class RegionsSelectFacade extends ArrayBaseFacade<
    RegionsSelectEntity,
    void
> {
    private readonly uiFeedback = inject(UiFeedbackService);
    private readonly fetchUseCase = inject(RegionsSelectUseCase);

    private hasInitialized = false;
    private lastFetchTimestamp = 0;

    readAll(options: FetchOptions = {}): void {
        this.fetchWithFilter(
            null,
            this.fetchUseCase.execute.bind(this.fetchUseCase, options),
            this.uiFeedback
        );

        this.hasInitialized = true;
        this.lastFetchTimestamp = Date.now();
    }
}
