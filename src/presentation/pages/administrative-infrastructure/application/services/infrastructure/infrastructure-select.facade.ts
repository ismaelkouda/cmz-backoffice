import { inject, Injectable } from '@angular/core';
import { InfrastructureSelectUseCase } from '@presentation/pages/administrative-infrastructure/application/use-cases/infrastructure/infrastructure-select.use-case';
import { ArrayBaseFacade } from '@shared/application/services/array-base-facade';
import { SelectOption } from '@shared/domain/interfaces/select-option.interface';

import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class InfrastructureSelectFacade extends ArrayBaseFacade<
    SelectOption,
    void
> {
    private readonly uiFeedback = inject(UiFeedbackService);
    private readonly useCase = inject(InfrastructureSelectUseCase);

    readAll(options: FetchOptions = {}): void {
        this.fetchWithFilter(
            null,
            this.useCase.readAll.bind(this.useCase, options),
            this.uiFeedback
        );
    }
}
