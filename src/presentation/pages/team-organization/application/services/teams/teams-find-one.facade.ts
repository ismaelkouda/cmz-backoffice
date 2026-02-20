import { inject, Injectable } from '@angular/core';

import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';

import { TeamsFindOneFilterDto } from '@presentation/pages/team-organization/application/dto/teams/teams-findone-filter.dto';
import { TeamsFindOneQuery } from '@presentation/pages/team-organization/application/queries/teams/teams-find-one.query';
import { TeamsFindOneBus } from '@presentation/pages/team-organization/application/queries-bus/teams/teams-find-one.bus';
import { TeamsFindOneEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-find-one.entity';

@Injectable({
    providedIn: 'root',
})
export class TeamsFindOneFacade extends ObjectBaseFacade<
    TeamsFindOneEntity,
    TeamsFindOneFilterDto
> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(TeamsFindOneBus);

    private readonly STALE_TIME = 2 * 60 * 1000;

    read(filter: TeamsFindOneFilterDto, force = false): void {
        const command = new TeamsFindOneQuery(filter.uniqId);
        const fetch$ = this.bus.dispatch(command);
        this.fetch(filter, fetch$, this.ui, this.STALE_TIME, force);
    }
}
