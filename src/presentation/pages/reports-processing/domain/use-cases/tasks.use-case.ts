import { inject, Injectable } from '@angular/core';
import { Paginate } from '@shared/interfaces/paginate';
import { Observable } from 'rxjs';
import { TasksEntity } from '../entities/tasks/tasks.entity';
import { TasksRepository } from '../repositories/tasks.repository';
import { TasksFilter } from '../value-objects/tasks-filter.vo';

@Injectable({
    providedIn: 'root',
})
export class FetchTasksUseCase {
    private readonly tasksRepository = inject(TasksRepository);

    execute(
        filter: TasksFilter,
        page: string
    ): Observable<Paginate<TasksEntity>> {
        return this.tasksRepository.fetchTasks(filter, page);
    }
}
