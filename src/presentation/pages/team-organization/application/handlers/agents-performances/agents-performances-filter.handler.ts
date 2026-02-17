import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dtos/simple-response.dto';

import { AgentsPerformancesEntity } from '@presentation/pages/team-organization/domain/entities/agents-performances/agents-performances.entity';

import { AgentsPerformancesFilterCommand } from '../../commands/agents-performances/agents-performances-filter.command';
import { AgentsPerformancesUseCase } from '../../use-cases/agents-performances/agents-performances.use-case';

@Injectable({ providedIn: 'root' })
export class AgentsPerformancesFilterHandler {
    constructor(private readonly useCase: AgentsPerformancesUseCase) {}

    execute(
        command: AgentsPerformancesFilterCommand,
        page: string
    ): Observable<Paginate<AgentsPerformancesEntity>> {
        return this.useCase.execute(
            {
                search: command.search,
                member: command.member,
                isAchieved: command.isAchieved,
                startDate: command.startDate,
                endDate: command.endDate,
            },
            page
        );
    }
}
