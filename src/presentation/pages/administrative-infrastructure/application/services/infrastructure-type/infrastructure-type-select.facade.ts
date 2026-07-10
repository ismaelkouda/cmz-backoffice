import { inject, Injectable } from '@angular/core';
import { InfrastructureTypeSelectUseCase } from '@presentation/pages/administrative-infrastructure/application/use-cases/infrastructure-type/infrastructure-type-select.use-case';
import { InfrastructureTypeSelectEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure-type/infrastructure-type-select.entity';
import { ArrayBaseFacade } from '@shared/application/services/array-base-facade';

import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class InfrastructureTypeSelectFacade extends ArrayBaseFacade<
    InfrastructureTypeSelectEntity,
    void
> {
    private readonly uiFeedback = inject(UiFeedbackService);
    private readonly useCase = inject(InfrastructureTypeSelectUseCase);

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
