import { Observable } from 'rxjs';

import { TeamsFindOneFilterEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-findone-filter.entity';
import { TeamsFindOneEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-findone.entity';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export abstract class TeamsFindOneRepository {
    abstract read(filter: TeamsFindOneFilterEntity): Observable<TeamsFindOneEntity>;
}
