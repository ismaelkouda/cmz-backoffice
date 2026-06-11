import { Injectable, inject } from '@angular/core';
import { AgentsPerformancesQuery } from '@pages/team-organization/application/queries/agents-performances/agents-performances.query';
import { AgentsPerformancesHandler } from '@pages/team-organization/application/queries-handlers/agents-performances/agents-performances.handler';
import { AgentsPerformancesEntity } from '@pages/team-organization/domain/entities/agents-performances/agents-performances.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({ providedIn: 'root' })
export class AgentsPerformancesBus {
    private readonly filterHandler = inject(AgentsPerformancesHandler);

    dispatch<T>(
        query: T,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<AgentsPerformancesEntity>> {
        if (query instanceof AgentsPerformancesQuery) {
            return this.filterHandler.execute(query, page, options);
        }

        throw new Error('No handler found for query');
    }
}
