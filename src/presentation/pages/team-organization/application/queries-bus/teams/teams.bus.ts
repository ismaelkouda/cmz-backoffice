import { Injectable, inject } from '@angular/core';
import { TeamsQuery } from '@pages/team-organization/application/queries/teams/teams.query';
import { TeamsHandler } from '@pages/team-organization/application/queries-handlers/teams/teams.handler';
import { TeamsEntity } from '@pages/team-organization/domain/entities/teams/teams.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TeamsBus {
    private readonly filterHandler = inject(TeamsHandler);

    dispatch<T>(query: T, page: string): Observable<Paginate<TeamsEntity>> {
        if (query instanceof TeamsQuery) {
            return this.filterHandler.execute(query, page);
        }

        throw new Error('No handler found for query');
    }
}
