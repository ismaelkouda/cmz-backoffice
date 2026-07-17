import { tasksQueryMapper } from '@pages/finalization/application/queries-mappers/tasks/tasks.mapper';
import { Injectable, inject } from '@angular/core';
import { TasksQuery } from '@pages/finalization/application/queries/tasks/tasks.query';
import { TasksUseCase } from '@pages/finalization/application/use-cases/tasks/tasks.use-case';
import { TasksEntity } from '@pages/finalization/domain/entities/tasks/tasks.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TasksHandler {
    private readonly useCase = inject(TasksUseCase);

    execute(
        query: TasksQuery,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<TasksEntity>> {
        return this.useCase.execute(tasksQueryMapper(query), page, options);
    }
}
