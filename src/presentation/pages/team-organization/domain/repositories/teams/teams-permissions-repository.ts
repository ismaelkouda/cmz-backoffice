import { Injectable } from '@angular/core';
import { TeamsPermissionsEntity } from '@pages/team-organization/domain/entities/teams/teams-permissions.entity';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export abstract class TeamsPermissionsRepository {
    abstract execute(): Observable<TeamsPermissionsEntity>;
}
