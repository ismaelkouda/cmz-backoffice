import { tasksActionsQueryMapper } from '@pages/processing/application/queries-mappers/tasks/tasks-actions.mapper';
import { Injectable, inject } from '@angular/core';
import { TasksActionsQuery } from '@pages/processing/application/queries/tasks/tasks-actions.query';
import { TasksActionsUseCase } from '@pages/processing/application/use-cases/tasks/tasks-actions.use-case';
import { TasksActionsEntity } from '@pages/processing/domain/entities/tasks/tasks-actions.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TasksActionsHandler {
    private readonly useCase = inject(TasksActionsUseCase);

    execute(
        query: TasksActionsQuery,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<TasksActionsEntity>> {
        return this.useCase.execute(
            tasksActionsQueryMapper(query),
            page,
            options
        );
    }
}
