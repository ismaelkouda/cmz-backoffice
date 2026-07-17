import { inject, Injectable } from '@angular/core';
import { TowerTypeSelectUseCase } from '@pages/coverage-areas/application/use-cases/tower-type/tower-type-select.use-case';
import { ArrayBaseFacade } from '@shared/application/services/array-base-facade';
import { SelectOption } from '@shared/domain/interfaces/select-option.interface';

import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class TowerTypeSelectFacade extends ArrayBaseFacade<SelectOption, void> {
    private readonly uiFeedback = inject(UiFeedbackService);
    private readonly useCase = inject(TowerTypeSelectUseCase);

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
