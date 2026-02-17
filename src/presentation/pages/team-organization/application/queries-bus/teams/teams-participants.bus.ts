import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { TeamsParticipantsQuery } from '@presentation/pages/team-organization/application/queries/teams/teams-participants.query';
import { TeamsParticipantsHandler } from '@presentation/pages/team-organization/application/queries-handlers/teams/teams-participants.handler';
import { TeamsParticipantsEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-participants.entity';

@Injectable({ providedIn: 'root' })
export class TeamsParticipantsBus {
    constructor(private readonly filterHandler: TeamsParticipantsHandler) {}

    dispatch<T>(
        command: T,
        page: string
    ): Observable<Paginate<TeamsParticipantsEntity>> {
        if (command instanceof TeamsParticipantsQuery) {
            return this.filterHandler.execute(command, page);
        }

        throw new Error('No handler found for command');
    }
}
