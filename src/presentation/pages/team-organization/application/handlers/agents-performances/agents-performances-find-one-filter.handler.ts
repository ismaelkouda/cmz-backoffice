import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dtos/simple-response.dto';

import { AgentsPerformancesFindOneEntity } from '@presentation/pages/team-organization/domain/entities/agents-performances/agents-performances-find-one.entity';

import { AgentsPerformancesFindOneFilterCommand } from '../../commands/agents-performances/agents-performances-find-one-filter.command';
import { AgentsPerformancesFindOneUseCase } from '../../use-cases/agents-performances/agents-performances-find-one.use-case';

@Injectable({ providedIn: 'root' })
export class AgentsPerformancesFindOneFilterHandler {
    constructor(private readonly useCase: AgentsPerformancesFindOneUseCase) {}

    execute(
        command: AgentsPerformancesFindOneFilterCommand,
        page: string
    ): Observable<Paginate<AgentsPerformancesFindOneEntity>> {
        return this.useCase.execute(
            {
                uniqId: command.uniqId,
                search: command.search,
                reportType: command.reportType,
                operators: command.operators,
                startDate: command.startDate,
                endDate: command.endDate,
            },
            page
        );
    }
}
