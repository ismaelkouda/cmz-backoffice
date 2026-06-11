import { Injectable, inject } from '@angular/core';
import { TeamsPermissionsHandler } from '@pages/team-organization/application/queries-handlers/teams/teams-permissions.handler';
import { TeamsPermissionsEntity } from '@pages/team-organization/domain/entities/teams/teams-permissions.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TeamsPermissionsBus {
    private readonly filterHandler = inject(TeamsPermissionsHandler);

    dispatch(options?: FetchOptions): Observable<TeamsPermissionsEntity> {
        return this.filterHandler.execute(options);
    }
}
