import { inject, Injectable } from '@angular/core';
import { TeamsFindOneFilterEntity } from '@pages/team-organization/domain/entities/teams/teams-find-one-filter.entity';
import { TeamsFindOneEntity } from '@pages/team-organization/domain/entities/teams/teams-find-one.entity';
import { TeamsFindOneRepository } from '@pages/team-organization/domain/repositories/teams/teams-find-one-repository';
import { teamsFindOneFilterMapper } from '@pages/team-organization/infrastructure/data/mappers/teams/teams-find-one-filter.mapper';
import { TeamsFindOneMapper } from '@pages/team-organization/infrastructure/data/mappers/teams/teams-find-one.mapper';
import { TeamsFindOneApi } from '@pages/team-organization/infrastructure/data/sources/teams/teams-find-one.api';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TeamsFindOneRepositoryImpl implements TeamsFindOneRepository {
    private readonly api = inject(TeamsFindOneApi);
    private readonly mapper = inject(TeamsFindOneMapper);

    read(filter: TeamsFindOneFilterEntity): Observable<TeamsFindOneEntity> {
        const paramsDto = teamsFindOneFilterMapper(filter);
        return this.api
            .readAll(paramsDto)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
