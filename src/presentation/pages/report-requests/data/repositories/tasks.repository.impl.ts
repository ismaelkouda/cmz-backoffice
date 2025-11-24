import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TasksMapper } from '@presentation/pages/report-requests/data/mappers/tasks.mapper';
import { TasksApi } from '@presentation/pages/report-requests/data/sources/tasks.api';
import { TasksEntity } from '@presentation/pages/report-requests/domain/entities/tasks/tasks.entity';
import { TasksRepository } from '@presentation/pages/report-requests/domain/repositories/tasks.repository';
import { TasksFilter } from '@presentation/pages/report-requests/domain/value-objects/tasks-filter.vo';
import { Paginate } from '@shared/interfaces/paginate';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TasksRepositoryImpl extends TasksRepository {
    constructor(
        private readonly api: TasksApi,
        private readonly tasksMapper: TasksMapper,
        private readonly translateService: TranslateService
    ) {
        super();
    }

    fetchTasks(
        filter: TasksFilter,
        page: string
    ): Observable<Paginate<TasksEntity>> {
        return this.api.fetchTasks(filter.toDto(), page).pipe(
            map((response) => this.tasksMapper.mapFromDto(response)),
            catchError((error: unknown) =>
                throwError(
                    () =>
                        new Error(
                            error instanceof Error
                                ? error.message
                                : this.translateService.instant(
                                      'OVERSEEING_OPERATIONS.MESSAGES.ERROR.UNABLE_TO_FETCH_QUEUES'
                                  )
                        )
                )
            )
        );
    }
}
