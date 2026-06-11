import { Injectable, inject } from '@angular/core';
import { TeamsQuery } from '@pages/team-organization/application/queries/teams/teams.query';
import { TeamsHandler } from '@pages/team-organization/application/queries-handlers/teams/teams.handler';
import { TeamsEntity } from '@pages/team-organization/domain/entities/teams/teams.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({ providedIn: 'root' })
export class TeamsBus {
    private readonly filterHandler = inject(TeamsHandler);

    dispatch<T>(
        query: T,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<TeamsEntity>> {
        if (query instanceof TeamsQuery) {
            return this.filterHandler.execute(query, page, options);
        }

        throw new Error('No handler found for query');
    }
}
