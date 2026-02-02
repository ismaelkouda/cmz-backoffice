import { Observable } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dtos/simple-response.dto';

import { TeamsFreeParticipantsAssignEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-free-participants-assign.entity';
import { TeamsFreeParticipantsEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-free-participants.entity';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export abstract class TeamsFreeParticipantsRepository {
    abstract readAll(
        page: string
    ): Observable<Paginate<TeamsFreeParticipantsEntity>>;

    abstract assign(
        dto: TeamsFreeParticipantsAssignEntity
    ): Observable<SimpleResponseDto<void>>;
}
