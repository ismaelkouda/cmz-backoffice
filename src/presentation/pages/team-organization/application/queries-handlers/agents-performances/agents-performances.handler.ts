import { agentsPerformancesQueryMapper } from '@pages/team-organization/application/queries-mappers/agents-performances/agents-performances.mapper';
import { Injectable, inject } from '@angular/core';
import { AgentsPerformancesQuery } from '@pages/team-organization/application/queries/agents-performances/agents-performances.query';
import { AgentsPerformancesUseCase } from '@pages/team-organization/application/use-cases/agents-performances/agents-performances.use-case';
import { AgentsPerformancesEntity } from '@pages/team-organization/domain/entities/agents-performances/agents-performances.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AgentsPerformancesHandler {
    private readonly useCase = inject(AgentsPerformancesUseCase);

    execute(
        query: AgentsPerformancesQuery,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<AgentsPerformancesEntity>> {
        return this.useCase.execute(
            agentsPerformancesQueryMapper(query),
            page,
            options
        );
    }
}
