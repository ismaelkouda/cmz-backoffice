import { Injectable } from '@angular/core';
import { TeamsParticipantsAssignEntity } from '@pages/team-organization/domain/entities/teams/teams-participants-assign.entity';
import { TeamsParticipantsFilterEntity } from '@pages/team-organization/domain/entities/teams/teams-participants-filter.entity';
import { TeamsParticipantsReassignEntity } from '@pages/team-organization/domain/entities/teams/teams-participants-reassign.entity';
import { TeamsParticipantsRemoveEntity } from '@pages/team-organization/domain/entities/teams/teams-participants-remove.entity';
import { TeamsParticipantsEntity } from '@pages/team-organization/domain/entities/teams/teams-participants.entity';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export abstract class TeamsParticipantsRepository {
    abstract readAll(
        filter: TeamsParticipantsFilterEntity | null,
        page: string,
        options?: FetchOptions
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
