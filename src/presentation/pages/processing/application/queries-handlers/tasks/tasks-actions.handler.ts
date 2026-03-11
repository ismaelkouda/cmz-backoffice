import { Injectable } from '@angular/core';
import { TasksActionsQuery } from '@pages/processing/application/queries/tasks/tasks-actions.query';
import { TasksActionsUseCase } from '@pages/processing/application/use-cases/tasks/tasks-actions.use-case';
import { TasksActionsEntity } from '@pages/processing/domain/entities/tasks/tasks-actions.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

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
