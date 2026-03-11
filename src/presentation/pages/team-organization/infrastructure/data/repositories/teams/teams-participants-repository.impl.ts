import { inject, Injectable } from '@angular/core';
import { TeamsParticipantsAssignEntity } from '@pages/team-organization/domain/entities/teams/teams-participants-assign.entity';
import { TeamsParticipantsFilterEntity } from '@pages/team-organization/domain/entities/teams/teams-participants-filter.entity';
import { TeamsParticipantsReassignEntity } from '@pages/team-organization/domain/entities/teams/teams-participants-reassign.entity';
import { TeamsParticipantsRemoveEntity } from '@pages/team-organization/domain/entities/teams/teams-participants-remove.entity';
import { TeamsParticipantsEntity } from '@pages/team-organization/domain/entities/teams/teams-participants.entity';
import { TeamsParticipantsRepository } from '@pages/team-organization/domain/repositories/teams/teams-participants-repository';
import { teamsParticipantsAssignMapper } from '@pages/team-organization/infrastructure/data/mappers/teams/teams-participants-assign.mapper';
import { teamsParticipantsFilterMapper } from '@pages/team-organization/infrastructure/data/mappers/teams/teams-participants-filter.mapper';
import { teamsParticipantsReassignMapper } from '@pages/team-organization/infrastructure/data/mappers/teams/teams-participants-reassign.mapper';
import { teamsParticipantsRemoveMapper } from '@pages/team-organization/infrastructure/data/mappers/teams/teams-participants-remove.mapper';
import { TeamsParticipantsMapper } from '@pages/team-organization/infrastructure/data/mappers/teams/teams-participants.mapper';
import { TeamsParticipantsApi } from '@pages/team-organization/infrastructure/data/sources/teams/teams-participants.api';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TeamsParticipantsRepositoryImpl implements TeamsParticipantsRepository {
    private readonly api = inject(TeamsParticipantsApi);
    private readonly mapper = inject(TeamsParticipantsMapper);

    readAll(
        filter: TeamsParticipantsFilterEntity,
        page: string
    ): Observable<Paginate<TeamsParticipantsEntity>> {
        const paramsDto = teamsParticipantsFilterMapper(filter);
        return this.api
            .readAll(paramsDto, page)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    reassign(
        dto: TeamsParticipantsReassignEntity
    ): Observable<SimpleResponseDto<void>> {
        const dtoApi = teamsParticipantsReassignMapper(dto);
        return this.api.reassign(dtoApi);
    }

    assign(
        dto: TeamsParticipantsAssignEntity
    ): Observable<SimpleResponseDto<void>> {
        const dtoApi = teamsParticipantsAssignMapper(dto);
        return this.api.assign(dtoApi);
    }

    remove(
        dto: TeamsParticipantsRemoveEntity
    ): Observable<SimpleResponseDto<void>> {
        const dtoApi = teamsParticipantsRemoveMapper(dto);
        return this.api.remove(dtoApi);
    }
}
