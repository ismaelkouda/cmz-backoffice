import { inject, Injectable } from '@angular/core';
import { TeamsSelectUseCase } from '@pages/team-organization/application/use-cases/teams/teams-select.use-case';
import { TeamsSelectEntity } from '@pages/team-organization/domain/entities/teams/teams-select.entity';
import { ArrayBaseFacade } from '@shared/application/services/array-base-facade';

import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class TeamsSelectFacade extends ArrayBaseFacade<
    TeamsSelectEntity,
    void
> {
    private readonly uiFeedback = inject(UiFeedbackService);
    private readonly useCase = inject(TeamsSelectUseCase);

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
