import { inject, Injectable } from '@angular/core';

import { shouldFetch } from '@shared/application/base/facade.utils';
import { ObjectBaseFacade } from '@shared/application/base/object-base-facade';
import { UiFeedbackService } from '@shared/application/ui/ui-feedback.service';

import { TeamsFindOneFilterDto } from '@presentation/pages/team-organization/application/dtos/teams/teams-findone-filter.dto';
import { TeamsFindOneUseCase } from '@presentation/pages/team-organization/application/use-cases/teams/teams-findone.use-case';
import { TeamsFindOneEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-findone.entity';

@Injectable({
    providedIn: 'root',
})
export class TeamsFindOneFacade extends ObjectBaseFacade<
    TeamsFindOneEntity,
    TeamsFindOneFilterDto
> {
    private readonly uiFeedbackService = inject(UiFeedbackService);
    private readonly useCase = inject(TeamsFindOneUseCase);

    readonly item$ = this.items$;

    private hasInitialized = false;
    private lastFetchTimestamp = 0;
    private readonly STALE_TIME = 2 * 60 * 1000;

    read(filter: TeamsFindOneFilterDto, forceRefresh = false): void {
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
