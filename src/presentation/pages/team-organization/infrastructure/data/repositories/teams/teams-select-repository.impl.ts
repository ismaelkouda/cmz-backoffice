import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { TeamsSelectEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-select.entity';
import { TeamsSelectRepository } from '@presentation/pages/team-organization/domain/repositories/teams/teams-select-repository';
import { TeamsSelectMapper } from '@presentation/pages/team-organization/infrastructure/data/mappers/teams/teams-select.mapper';
import { TeamsSelectApi } from '@presentation/pages/team-organization/infrastructure/data/sources/teams/teams-select.api';

@Injectable({ providedIn: 'root' })
export class TeamsSelectRepositoryImpl implements TeamsSelectRepository {
    private readonly api = inject(TeamsSelectApi);
    private readonly mapper = inject(TeamsSelectMapper);

    readAll(): Observable<TeamsSelectEntity[]> {
        return this.api
            .readAll()
            .pipe(map((dto) => this.mapper.mapFromDto(dto)));
    }
}
