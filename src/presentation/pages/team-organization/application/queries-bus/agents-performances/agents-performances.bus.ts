import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { AgentsPerformancesQuery } from '@presentation/pages/team-organization/application/queries/agents-performances/agents-performances.query';
import { AgentsPerformancesHandler } from '@presentation/pages/team-organization/application/queries-handlers/agents-performances/agents-performances.handler';
import { AgentsPerformancesEntity } from '@presentation/pages/team-organization/domain/entities/agents-performances/agents-performances.entity';

@Injectable({ providedIn: 'root' })
export class AgentsPerformancesBus {
    constructor(private readonly filterHandler: AgentsPerformancesHandler) {}

    dispatch<T>(
        query: T,
        page: string
    ): Observable<Paginate<AgentsPerformancesEntity>> {
        if (query instanceof AgentsPerformancesQuery) {
            return this.filterHandler.execute(query, page);
        }

        throw new Error('No handler found for query');
    }
}
