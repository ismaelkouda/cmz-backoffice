import { Injectable } from '@angular/core';
import { TasksMapper } from '@presentation/pages/report-requests/data/mappers/tasks.mapper';
import { TasksApi } from '@presentation/pages/report-requests/data/sources/tasks.api';
import { TasksEntity } from '@presentation/pages/report-requests/domain/entities/tasks/tasks.entity';
import { TasksRepository } from '@presentation/pages/report-requests/domain/repositories/tasks.repository';
import { TasksFilter } from '@presentation/pages/report-requests/domain/value-objects/tasks-filter.vo';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TasksRepositoryImpl extends TasksRepository {
    constructor(
        private readonly api: TasksApi,
        private readonly tasksMapper: TasksMapper,
    ) {
        super();
    }

    fetchTasks(
        filter: TasksFilter | null,
        page: string
    ): Observable<Paginate<TasksEntity>> {
        return this.api.fetchTasks(filter?.toDto() ?? {}, page).pipe(
            map((response) => this.tasksMapper.mapFromDto(response))
        );
    }
}
