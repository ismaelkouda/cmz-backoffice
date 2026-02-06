import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TeamsPermissionsEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-permissions.entity';

@Injectable({
    providedIn: 'root',
})
export abstract class TeamsPermissionsRepository {
    abstract readAll(): Observable<TeamsPermissionsEntity>;
}
