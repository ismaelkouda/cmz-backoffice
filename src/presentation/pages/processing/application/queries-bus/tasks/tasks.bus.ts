import { Injectable } from '@angular/core';
import { TasksQuery } from '@pages/processing/application/queries/tasks/tasks.query';
import { TasksHandler } from '@pages/processing/application/queries-handlers/tasks/tasks.handler';
import { TasksEntity } from '@pages/processing/domain/entities/tasks/tasks.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

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
