import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { AgentsPerformancesQuery } from '@presentation/pages/team-organization/application/queries/agents-performances/agents-performances.query';
import { AgentsPerformancesUseCase } from '@presentation/pages/team-organization/application/use-cases/agents-performances/agents-performances.use-case';
import { AgentsPerformancesEntity } from '@presentation/pages/team-organization/domain/entities/agents-performances/agents-performances.entity';

@Injectable({ providedIn: 'root' })
export class AgentsPerformancesHandler {
    constructor(private readonly useCase: AgentsPerformancesUseCase) {}

    execute(
        query: AgentsPerformancesQuery,
        page: string
    ): Observable<Paginate<AgentsPerformancesEntity>> {
        return this.useCase.execute(
            {
                search: query.search,
                member: query.member,
                isAchieved: query.isAchieved,
                startDate: query.startDate,
                endDate: query.endDate,
            },
            page
        );
    }
}
