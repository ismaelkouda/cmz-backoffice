import { inject, Injectable } from '@angular/core';

import { shouldFetch } from '@shared/application/base/facade.utils';
import { ObjectBaseFacade } from '@shared/application/base/object-base-facade';
import { UiFeedbackService } from '@shared/application/ui/ui-feedback.service';

import { ParticipantsFindOneFilterDto } from '@presentation/pages/team-organization/application/dtos/participants/participants-findone-filter.dto';
import { ParticipantsFindonUseCase } from '@presentation/pages/team-organization/application/use-cases/participants/participants-findone.use-case';
import { ParticipantsFindOneEntity } from '@presentation/pages/team-organization/domain/entities/participants/participants-findone.entity';

@Injectable({
    providedIn: 'root',
})
export class ParticipantsFindoneFacade extends ObjectBaseFacade<
    ParticipantsFindOneEntity,
    ParticipantsFindOneFilterDto
> {
    private readonly uiFeedbackService = inject(UiFeedbackService);
    private readonly useCase = inject(ParticipantsFindonUseCase);

    readonly item$ = this.items$;

    private hasInitialized = false;
    private lastFetchTimestamp = 0;
    private readonly STALE_TIME = 2 * 60 * 1000;

    read(filter: ParticipantsFindOneFilterDto, forceRefresh = false): void {
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
