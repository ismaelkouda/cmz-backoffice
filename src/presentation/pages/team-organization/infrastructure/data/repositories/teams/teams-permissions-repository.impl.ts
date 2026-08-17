import { inject, Injectable } from '@angular/core';
import { TeamsPermissionsEntity } from '@pages/team-organization/domain/entities/teams/teams-permissions.entity';
import { TeamsPermissionsRepository } from '@pages/team-organization/domain/repositories/teams/teams-permissions-repository';
import { TeamsPermissionsMapper } from '@pages/team-organization/infrastructure/data/mappers/teams/teams-permissions.mapper';
import { TeamsPermissionsApi } from '@pages/team-organization/infrastructure/data/sources/teams/teams-permissions.api';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TeamsPermissionsRepositoryImpl implements TeamsPermissionsRepository {
    private readonly api = inject(TeamsPermissionsApi);
    private readonly mapper = inject(TeamsPermissionsMapper);

    execute(options?: FetchOptions): Observable<TeamsPermissionsEntity> {
        return this.api
            .execute(options)
            .pipe(map((dto) => this.mapper.mapFromDto(dto)));
    }
}
