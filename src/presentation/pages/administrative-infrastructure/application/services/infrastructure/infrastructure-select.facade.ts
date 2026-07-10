import { inject, Injectable } from '@angular/core';
import { InfrastructureSelectUseCase } from '@presentation/pages/administrative-infrastructure/application/use-cases/infrastructure/infrastructure-select.use-case';
import { InfrastructureSelectEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure/infrastructure-select.entity';
import { ArrayBaseFacade } from '@shared/application/services/array-base-facade';

import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class InfrastructureSelectFacade extends ArrayBaseFacade<
    InfrastructureSelectEntity,
    void
> {
    private readonly uiFeedback = inject(UiFeedbackService);
    private readonly useCase = inject(InfrastructureSelectUseCase);

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
