import { inject, Injectable } from '@angular/core';

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
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(ParticipantsFindOneBus);

    private readonly STALE_TIME = 2 * 60 * 1000;

    read(filter: ParticipantsFindOneFilterDto, force = false): void {
        const command = new ParticipantsFindOneQuery(filter.uniqId);
        const fetch$ = this.bus.dispatch(command);
        this.fetch(filter, fetch$, this.ui, this.STALE_TIME, force);
    }
}
