import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { TasksQuery } from '@presentation/pages/requests/application/queries/tasks/tasks.query';
import { TasksHandler } from '@presentation/pages/requests/application/queries-handlers/tasks/tasks.handler';
import { TasksEntity } from '@presentation/pages/requests/domain/entities/tasks/tasks.entity';

@Injectable({ providedIn: 'root' })
export class TasksBus {
    constructor(private readonly filterHandler: TasksHandler) {}

    dispatch<T>(query: T, page: string): Observable<Paginate<TasksEntity>> {
        if (query instanceof TasksQuery) {
            return this.filterHandler.execute(query, page);
        }

        throw new Error('No handler found for query');
    }
}
