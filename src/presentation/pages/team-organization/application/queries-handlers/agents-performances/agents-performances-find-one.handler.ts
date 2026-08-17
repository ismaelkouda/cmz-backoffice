import { agentsPerformancesFindOneQueryMapper } from '@pages/team-organization/application/queries-mappers/agents-performances/agents-performances-find-one.mapper';
import { Injectable, inject } from '@angular/core';
import { AgentsPerformancesFindOneQuery } from '@pages/team-organization/application/queries/agents-performances/agents-performances-find-one.query';
import { AgentsPerformancesFindOneUseCase } from '@pages/team-organization/application/use-cases/agents-performances/agents-performances-find-one.use-case';
import { AgentsPerformancesFindOneEntity } from '@pages/team-organization/domain/entities/agents-performances/agents-performances-find-one.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AgentsPerformancesFindOneHandler {
    private readonly useCase = inject(AgentsPerformancesFindOneUseCase);

    execute(
        query: AgentsPerformancesFindOneQuery,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<AgentsPerformancesFindOneEntity>> {
        return this.useCase.execute(
            agentsPerformancesFindOneQueryMapper(query),
            page,
            options
        );
    }
}
