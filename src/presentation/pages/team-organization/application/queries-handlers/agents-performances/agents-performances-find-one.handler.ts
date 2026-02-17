import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { AgentsPerformancesFindOneQuery } from '@presentation/pages/team-organization/application/queries/agents-performances/agents-performances-find-one.query';
import { AgentsPerformancesFindOneUseCase } from '@presentation/pages/team-organization/application/use-cases/agents-performances/agents-performances-find-one.use-case';
import { AgentsPerformancesFindOneEntity } from '@presentation/pages/team-organization/domain/entities/agents-performances/agents-performances-find-one.entity';

@Injectable({ providedIn: 'root' })
export class AgentsPerformancesFindOneHandler {
    constructor(private readonly useCase: AgentsPerformancesFindOneUseCase) {}

    execute(
        query: AgentsPerformancesFindOneQuery,
        page: string
    ): Observable<Paginate<AgentsPerformancesFindOneEntity>> {
        return this.useCase.execute(
            {
                uniqId: query.uniqId,
                search: query.search,
                reportType: query.reportType,
                operators: query.operators,
                startDate: query.startDate,
                endDate: query.endDate,
            },
            page
        );
    }
}
