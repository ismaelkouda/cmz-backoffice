import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dtos/simple-response.dto';

import { TeamsParticipantsAssignEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-participants-assign.entity';
import { TeamsParticipantsFilterEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-participants-filter.entity';
import { TeamsParticipantsReassignEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-participants-reassign.entity';
import { TeamsParticipantsRemoveEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-participants-remove.entity';
import { TeamsParticipantsEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-participants.entity';

@Injectable({
    providedIn: 'root',
})
export abstract class TeamsParticipantsRepository {
    abstract readAll(
        filter: TeamsParticipantsFilterEntity | null,
        page: string
    ): Observable<Paginate<TeamsParticipantsEntity>>;

    abstract reassign(
        dto: TeamsParticipantsReassignEntity
    ): Observable<SimpleResponseDto<void>>;

    abstract assign(
        dto: TeamsParticipantsAssignEntity
    ): Observable<SimpleResponseDto<void>>;

    abstract remove(
        dto: TeamsParticipantsRemoveEntity
    ): Observable<SimpleResponseDto<void>>;
}
