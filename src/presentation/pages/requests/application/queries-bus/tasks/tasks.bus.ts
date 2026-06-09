import { Injectable, inject } from '@angular/core';
import { TasksQuery } from '@pages/requests/application/queries/tasks/tasks.query';
import { TasksHandler } from '@pages/requests/application/queries-handlers/tasks/tasks.handler';
import { TasksEntity } from '@pages/requests/domain/entities/tasks/tasks.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TasksBus {
    private readonly filterHandler = inject(TasksHandler);

    dispatch<T>(
        query: T,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<TasksEntity>> {
        if (query instanceof TasksQuery) {
            return this.filterHandler.execute(query, page, options);
        }

        throw new Error('No handler found for query');
    }
}
