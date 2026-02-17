import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { TeamsQuery } from '@presentation/pages/team-organization/application/queries/teams/teams.query';
import { TeamsHandler } from '@presentation/pages/team-organization/application/queries-handlers/teams/teams.handler';
import { TeamsEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams.entity';

@Injectable({ providedIn: 'root' })
export class TeamsBus {
    constructor(private readonly filterHandler: TeamsHandler) {}

    dispatch<T>(query: T, page: string): Observable<Paginate<TeamsEntity>> {
        if (query instanceof TeamsQuery) {
            return this.filterHandler.execute(query, page);
        }

        throw new Error('No handler found for query');
    }
}
