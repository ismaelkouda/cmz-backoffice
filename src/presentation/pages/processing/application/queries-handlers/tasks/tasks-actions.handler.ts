import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { TasksActionsQuery } from '@presentation/pages/processing/application/queries/tasks/tasks-actions.query';
import { TasksActionsUseCase } from '@presentation/pages/processing/application/use-cases/tasks/tasks-actions.use-case';
import { TasksActionsEntity } from '@presentation/pages/processing/domain/entities/tasks/tasks-actions.entity';

@Injectable({ providedIn: 'root' })
export class TasksActionsHandler {
    constructor(private readonly useCase: TasksActionsUseCase) {}

    execute(
        query: TasksActionsQuery,
        page: string
    ): Observable<Paginate<TasksActionsEntity>> {
        return this.useCase.execute(
            {
                uniqId: query.uniqId,
            },
            page
        );
    }
}
