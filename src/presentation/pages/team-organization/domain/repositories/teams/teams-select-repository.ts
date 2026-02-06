import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TeamsSelectEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-select.entity';

@Injectable({
    providedIn: 'root',
})
export abstract class TeamsSelectRepository {
    abstract readAll(): Observable<TeamsSelectEntity[]>;
}
