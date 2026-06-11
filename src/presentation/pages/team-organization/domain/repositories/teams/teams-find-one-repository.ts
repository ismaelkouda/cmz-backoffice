import { Injectable } from '@angular/core';
import { TeamsFindOneFilterEntity } from '@pages/team-organization/domain/entities/teams/teams-find-one-filter.entity';
import { TeamsFindOneEntity } from '@pages/team-organization/domain/entities/teams/teams-find-one.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export abstract class TeamsFindOneRepository {
    abstract read(
        filter: TeamsFindOneFilterEntity,
        options?: FetchOptions
    ): Observable<TeamsFindOneEntity>;
}
