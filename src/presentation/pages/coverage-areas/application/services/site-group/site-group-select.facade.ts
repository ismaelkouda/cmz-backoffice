import { inject, Injectable } from '@angular/core';
import { SiteGroupSelectUseCase } from '@pages/coverage-areas/application/use-cases/site-group/site-group-select.use-case';
import { ArrayBaseFacade } from '@shared/application/services/array-base-facade';
import { SelectOption } from '@shared/domain/interfaces/select-option.interface';

import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class SiteGroupSelectFacade extends ArrayBaseFacade<
    SelectOption,
    void
> {
    private readonly uiFeedback = inject(UiFeedbackService);
    private readonly useCase = inject(SiteGroupSelectUseCase);

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
