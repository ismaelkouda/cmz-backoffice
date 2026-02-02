import { Observable } from 'rxjs';

import { TeamsSelectEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-select.entity';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export abstract class TeamsSelectRepository {
    abstract readAll(): Observable<TeamsSelectEntity[]>;
}
