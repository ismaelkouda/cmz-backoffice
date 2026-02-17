import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { TasksActionsQuery } from '@presentation/pages/processing/application/queries/tasks/tasks-actions.query';
import { TasksActionsHandler } from '@presentation/pages/processing/application/queries-handlers/tasks/tasks-actions.handler';
import { TasksActionsEntity } from '@presentation/pages/processing/domain/entities/tasks/tasks-actions.entity';

@Injectable({ providedIn: 'root' })
export class TasksActionsBus {
    constructor(private readonly filterHandler: TasksActionsHandler) {}

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
