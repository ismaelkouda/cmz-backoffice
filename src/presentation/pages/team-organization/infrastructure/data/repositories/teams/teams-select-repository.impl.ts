import { inject, Injectable } from '@angular/core';
import { TeamsSelectEntity } from '@pages/team-organization/domain/entities/teams/teams-select.entity';
import { TeamsSelectRepository } from '@pages/team-organization/domain/repositories/teams/teams-select-repository';
import { TeamsSelectMapper } from '@pages/team-organization/infrastructure/data/mappers/teams/teams-select.mapper';
import { TeamsSelectApi } from '@pages/team-organization/infrastructure/data/sources/teams/teams-select.api';
import { map, Observable } from 'rxjs';

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
