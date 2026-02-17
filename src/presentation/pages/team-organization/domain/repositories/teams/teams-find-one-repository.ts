import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TeamsFindOneFilterEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-find-one-filter.entity';
import { TeamsFindOneEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-find-one.entity';

@Injectable({
    providedIn: 'root',
})
export abstract class TeamsFindOneRepository {
    abstract read(
        filter: TeamsFindOneFilterEntity
    ): Observable<TeamsFindOneEntity>;
}
