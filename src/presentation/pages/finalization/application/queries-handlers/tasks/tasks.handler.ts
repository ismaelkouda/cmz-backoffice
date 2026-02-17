import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { TasksQuery } from '@presentation/pages/finalization/application/queries/tasks/tasks.query';
import { TasksUseCase } from '@presentation/pages/finalization/application/use-cases/tasks/tasks.use-case';
import { TasksEntity } from '@presentation/pages/finalization/domain/entities/tasks/tasks.entity';

@Injectable({ providedIn: 'root' })
export class TasksHandler {
    constructor(private readonly useCase: TasksUseCase) {}

    execute(
        query: TasksQuery,
        page: string
    ): Observable<Paginate<TasksEntity>> {
        return this.useCase.execute(
            {
                initiatorPhoneNumber: query.initiatorPhoneNumber,
                uniqId: query.uniqId,
                reportType: query.reportType,
                operators: query.operators,
                source: query.source,
                startDate: query.startDate,
                endDate: query.endDate,
            },
            page
        );
    }
}
