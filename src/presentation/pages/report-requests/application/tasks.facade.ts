import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseFacade } from '@shared/application/base/base-facade';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { TasksEntity } from '../domain/entities/tasks/tasks.entity';
import { FetchTasksUseCase } from '../domain/use-cases/tasks.use-case';
import { TasksFilter } from '../domain/value-objects/tasks-filter.vo';

@Injectable({ providedIn: 'root' })
export class TasksFacade extends BaseFacade<TasksEntity, TasksFilter> {
    readonly tasks$: Observable<TasksEntity[]> = this.items$;

    constructor(
        private readonly fetchTasksUseCase: FetchTasksUseCase,
        toastService: ToastrService,
        translateService: TranslateService
    ) {
        super(toastService, translateService);
    }

    fetchTasks(
        filter: TasksFilter,
        page: string = PAGINATION_CONST.DEFAULT_PAGE
    ): void {
        const fetch$ = this.fetchTasksUseCase.execute(filter, page);
        this.fetchData(filter, page, fetch$);
    }

    changePage(pageNumber: number): void {
        const currentFilter = this.filterSubject.getValue();
        if (!currentFilter) {
            return;
        }
        const fetch$ = this.fetchTasksUseCase.execute(
            currentFilter,
            String(pageNumber)
        );
        this.changePageInternal(pageNumber, fetch$);
    }

    refresh(): void {
        const currentFilter = this.filterSubject.getValue();
        if (!currentFilter) {
            return;
        }
        const currentPage = this.pageSubject.getValue();
        const fetch$ = this.fetchTasksUseCase.execute(
            currentFilter,
            currentPage
        );
        this.fetchData(currentFilter, currentPage, fetch$);
    }
}
