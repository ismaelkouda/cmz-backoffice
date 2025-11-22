import { Injectable } from '@angular/core';
import { Paginate } from '@shared/interfaces/paginate';
import { Observable, map } from 'rxjs';
import { TasksEntity } from '../../domain/entities/tasks/tasks.entity';
import { TasksRepository } from '../../domain/repositories/tasks.repository';
import { TasksFilter } from '../../domain/value-objects/tasks-filter.vo';
import { TasksMapper } from '../mappers/tasks.mapper';
import { TasksApi } from '../sources/tasks.api';

@Injectable()
export class TasksRepositoryImpl extends TasksRepository {
    constructor(
        private readonly tasksApi: TasksApi,
        private readonly tasksMapper: TasksMapper
    ) {
        super();
    }

    fetchTasks(
        filter: TasksFilter,
        page: string
    ): Observable<Paginate<TasksEntity>> {
        return this.tasksApi
            .fetchTasks(filter.toDto(), page)
            .pipe(map((response) => this.tasksMapper.mapFromDto(response)));
    }
}
