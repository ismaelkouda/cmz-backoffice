import { Injectable } from '@angular/core';
import { TeamsParticipantsQuery } from '@pages/team-organization/application/queries/teams/teams-participants.query';
import { TeamsParticipantsHandler } from '@pages/team-organization/application/queries-handlers/teams/teams-participants.handler';
import { TeamsParticipantsEntity } from '@pages/team-organization/domain/entities/teams/teams-participants.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

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
