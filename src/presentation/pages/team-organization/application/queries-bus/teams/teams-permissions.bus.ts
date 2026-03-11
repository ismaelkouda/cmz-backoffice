import { Injectable } from '@angular/core';
import { TeamsPermissionsHandler } from '@pages/team-organization/application/queries-handlers/teams/teams-permissions.handler';
import { TeamsPermissionsEntity } from '@pages/team-organization/domain/entities/teams/teams-permissions.entity';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TeamsPermissionsBus {
    constructor(private readonly filterHandler: TeamsPermissionsHandler) {}

    dispatch(): Observable<TeamsPermissionsEntity> {
        return this.filterHandler.execute();
    }
}
