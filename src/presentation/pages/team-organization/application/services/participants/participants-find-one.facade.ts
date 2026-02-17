import { inject, Injectable } from '@angular/core';

import { shouldFetch } from '@shared/application/services/facade.utils';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';

import { ParticipantsFindOneFilterDto } from '@presentation/pages/team-organization/application/dto/participants/participants-find-one-filter.dto';
import { ParticipantsFindOneQuery } from '@presentation/pages/team-organization/application/queries/participants/participants-find-one.query';
import { ParticipantsFindOneBus } from '@presentation/pages/team-organization/application/queries-bus/participants/participants-find-one.bus';
import { ParticipantsFindOneEntity } from '@presentation/pages/team-organization/domain/entities/participants/participants-find-one.entity';

@Injectable({
    providedIn: 'root',
})
export class ParticipantsFindOneFacade extends ObjectBaseFacade<
    ParticipantsFindOneEntity,
    ParticipantsFindOneFilterDto
> {
    private readonly uiFeedbackService = inject(UiFeedbackService);
    private readonly bus = inject(ParticipantsFindOneBus);

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
        const command = new ParticipantsFindOneQuery(filter.uniqId);
        const fetch$ = this.bus.dispatch(command);
        this.fetchWithFilter(filter, fetch$, this.uiFeedbackService);

        this.hasInitialized = true;
        this.lastFetchTimestamp = Date.now();
    }
}
