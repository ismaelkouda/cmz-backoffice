import { Injectable, inject } from '@angular/core';
import { AgentsPerformancesQuery } from '@pages/team-organization/application/queries/agents-performances/agents-performances.query';
import { AgentsPerformancesUseCase } from '@pages/team-organization/application/use-cases/agents-performances/agents-performances.use-case';
import { AgentsPerformancesEntity } from '@pages/team-organization/domain/entities/agents-performances/agents-performances.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AgentsPerformancesHandler {
    private readonly useCase = inject(AgentsPerformancesUseCase);

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
