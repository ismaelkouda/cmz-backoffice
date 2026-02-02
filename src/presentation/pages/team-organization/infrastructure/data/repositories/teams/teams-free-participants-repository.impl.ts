import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dtos/simple-response.dto';

import { TeamsFreeParticipantsAssignEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-free-participants-assign.entity';
import { TeamsFreeParticipantsEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-free-participants.entity';
import { TeamsFreeParticipantsRepository } from '@presentation/pages/team-organization/domain/repositories/teams/teams-free-participants-repository';
import { teamsFreeParticipantsAssignMapper } from '@presentation/pages/team-organization/infrastructure/data/mappers/teams/teams-free-participants-assign.mapper';
import { TeamsFreeParticipantsMapper } from '@presentation/pages/team-organization/infrastructure/data/mappers/teams/teams-free-participants.mapper';
import { TeamsFreeParticipantsApi } from '@presentation/pages/team-organization/infrastructure/data/sources/teams/teams-free-participants.api';

@Injectable({ providedIn: 'root' })
export class TeamsFreeParticipantsRepositoryImpl
    implements TeamsFreeParticipantsRepository
{
    private readonly api = inject(TeamsFreeParticipantsApi);
    private readonly mapper = inject(TeamsFreeParticipantsMapper);

    readAll(page: string): Observable<Paginate<TeamsFreeParticipantsEntity>> {
        return this.api
            .readAll(page)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    assign(
        dto: TeamsFreeParticipantsAssignEntity
    ): Observable<SimpleResponseDto<void>> {
        const dtoApi = teamsFreeParticipantsAssignMapper(dto);
        return this.api.assign(dtoApi);
    }
}
