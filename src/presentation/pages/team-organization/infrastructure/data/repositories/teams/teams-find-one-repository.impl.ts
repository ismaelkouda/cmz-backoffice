import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { TeamsFindOneFilterEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-find-one-filter.entity';
import { TeamsFindOneEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-find-one.entity';
import { TeamsFindOneRepository } from '@presentation/pages/team-organization/domain/repositories/teams/teams-find-one-repository';
import { teamsFindOneFilterMapper } from '@presentation/pages/team-organization/infrastructure/data/mappers/teams/teams-find-one-filter.mapper';
import { TeamsFindOneMapper } from '@presentation/pages/team-organization/infrastructure/data/mappers/teams/teams-find-one.mapper';
import { TeamsFindOneApi } from '@presentation/pages/team-organization/infrastructure/data/sources/teams/teams-findone.api';

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
