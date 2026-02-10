import { inject, Injectable } from '@angular/core';

import { shouldFetch } from '@shared/application/base/facade.utils';
import { ObjectBaseFacade } from '@shared/application/base/object-base-facade';
import { UiFeedbackService } from '@shared/application/ui/ui-feedback.service';

import { AgentsPerformancesFindOneFilterDto } from '@presentation/pages/team-organization/application/dtos/agents-performances/agents-performances-findone-filter.dto';
import { AgentsPerformancesFindOneUseCase } from '@presentation/pages/team-organization/application/use-cases/agents-performances/agents-performances-findone.use-case';
import { AgentsPerformancesFindOneEntity } from '@presentation/pages/team-organization/domain/entities/agents-performances/agents-performances-findone.entity';

@Injectable({
    providedIn: 'root',
})
export class AgentsPerformancesFindOneFacade extends ObjectBaseFacade<
    AgentsPerformancesFindOneEntity,
    AgentsPerformancesFindOneFilterDto
> {
    private readonly uiFeedbackService = inject(UiFeedbackService);
    private readonly useCase = inject(AgentsPerformancesFindOneUseCase);

    readonly item$ = this.items$;

    private hasInitialized = false;
    private lastFetchTimestamp = 0;
    private readonly STALE_TIME = 2 * 60 * 1000;

    read(
        filter: AgentsPerformancesFindOneFilterDto,
        forceRefresh = false
    ): void {
        const hasData = this.itemsSubject.getValue() !== null;
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
            filter,
            this.useCase.read.bind(this.useCase),
            this.uiFeedbackService
        );

        this.hasInitialized = true;
        this.lastFetchTimestamp = Date.now();
    }
}
