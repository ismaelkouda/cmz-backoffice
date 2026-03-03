import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { TeamsParticipantsQuery } from '@presentation/pages/team-organization/application/queries/teams/teams-participants.query';
import { TeamsParticipantsUseCase } from '@presentation/pages/team-organization/application/use-cases/teams/teams-participants.use-case';
import { TeamsParticipantsEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-participants.entity';

@Injectable({ providedIn: 'root' })
export class TeamsParticipantsHandler {
    constructor(private readonly useCase: TeamsParticipantsUseCase) {}

    execute(
        command: TeamsParticipantsQuery,
        page: string
    ): Observable<Paginate<TeamsParticipantsEntity>> {
        return this.useCase.execute(
            {
                uniqId: command.uniqId,
                search: command.search,
            },
            page
        );
    }
}
