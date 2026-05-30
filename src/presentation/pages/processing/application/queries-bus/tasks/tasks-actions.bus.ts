import { Injectable, inject } from '@angular/core';
import { TasksActionsQuery } from '@pages/processing/application/queries/tasks/tasks-actions.query';
import { TasksActionsHandler } from '@pages/processing/application/queries-handlers/tasks/tasks-actions.handler';
import { TasksActionsEntity } from '@pages/processing/domain/entities/tasks/tasks-actions.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TasksActionsBus {
    private readonly filterHandler = inject(TasksActionsHandler);

    dispatch<T>(
        query: T,
        page: string
    ): Observable<Paginate<TasksActionsEntity>> {
        if (query instanceof TasksActionsQuery) {
            return this.filterHandler.execute(query, page);
        }

        throw new Error('No handler found for query');
    }
}
