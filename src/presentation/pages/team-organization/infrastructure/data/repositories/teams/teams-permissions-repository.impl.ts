import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { TeamsPermissionsEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-permissions.entity';
import { TeamsPermissionsRepository } from '@presentation/pages/team-organization/domain/repositories/teams/teams-permissions-repository';
import { TeamsPermissionsMapper } from '@presentation/pages/team-organization/infrastructure/data/mappers/teams/teams-permissions.mapper';
import { TeamsPermissionsApi } from '@presentation/pages/team-organization/infrastructure/data/sources/teams/teams-permissions.api';

@Injectable({ providedIn: 'root' })
export class TeamsPermissionsRepositoryImpl
    implements TeamsPermissionsRepository
{
    private readonly api = inject(TeamsPermissionsApi);
    private readonly mapper = inject(TeamsPermissionsMapper);

    readAll(): Observable<TeamsPermissionsEntity> {
        return this.api
            .readAll()
            .pipe(map((dto) => this.mapper.mapFromDto(dto)));
    }
}
