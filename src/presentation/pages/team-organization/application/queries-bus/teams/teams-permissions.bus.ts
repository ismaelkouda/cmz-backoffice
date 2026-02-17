import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TeamsPermissionsHandler } from '@presentation/pages/team-organization/application/queries-handlers/teams/teams-permissions.handler';
import { TeamsPermissionsEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-permissions.entity';

@Injectable({ providedIn: 'root' })
export class TeamsPermissionsBus {
    constructor(private readonly filterHandler: TeamsPermissionsHandler) {}

    dispatch(): Observable<TeamsPermissionsEntity> {
        return this.filterHandler.execute();
    }
}
