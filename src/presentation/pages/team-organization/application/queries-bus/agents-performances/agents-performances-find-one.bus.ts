import { Injectable } from '@angular/core';
import { AgentsPerformancesFindOneQuery } from '@pages/team-organization/application/queries/agents-performances/agents-performances-find-one.query';
import { AgentsPerformancesFindOneHandler } from '@pages/team-organization/application/queries-handlers/agents-performances/agents-performances-find-one.handler';
import { AgentsPerformancesFindOneEntity } from '@pages/team-organization/domain/entities/agents-performances/agents-performances-find-one.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AgentsPerformancesFindOneBus {
    constructor(
        private readonly filterHandler: AgentsPerformancesFindOneHandler
    ) {}

    dispatch<T>(
        query: T,
        page: string
    ): Observable<Paginate<AgentsPerformancesFindOneEntity>> {
        if (query instanceof AgentsPerformancesFindOneQuery) {
            return this.filterHandler.execute(query, page);
        }

        throw new Error('No handler found for query');
    }
}
