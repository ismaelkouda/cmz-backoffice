import { inject, Injectable } from '@angular/core';
import { TasksFilterEntity } from '@pages/processing/domain/entities/tasks/tasks-filter.entity';
import { TasksEntity } from '@pages/processing/domain/entities/tasks/tasks.entity';
import { TasksRepository } from '@pages/processing/domain/repositories/tasks/tasks.repository';
import { TasksFilterMapper } from '@pages/processing/infrastructure/data/mappers/tasks/tasks-filter.mapper';
import { TasksMapper } from '@pages/processing/infrastructure/data/mappers/tasks/tasks.mapper';
import { TasksApi } from '@pages/processing/infrastructure/data/sources/tasks/tasks.api';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable, map } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TasksRepositoryImpl extends TasksRepository {
    private readonly api = inject(TasksApi);
    private readonly mapper = inject(TasksMapper);
    private readonly filterMapper = inject(TasksFilterMapper);

    execute(
        entity: TasksFilterEntity,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<TasksEntity>> {
        return this.api
            .execute(this.filterMapper.map(entity), page, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
