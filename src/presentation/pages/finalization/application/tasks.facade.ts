import { inject, Injectable } from '@angular/core';
import { BaseFacade } from '@shared/application/base/base-facade';
import { shouldFetch } from '@shared/application/base/facade.utils';
import { UiFeedbackService } from '@shared/application/ui/ui-feedback.service';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { Observable } from 'rxjs';
import { TasksEntity } from '../domain/entities/tasks/tasks.entity';
import { FetchTasksUseCase } from '../domain/use-cases/tasks.use-case';
import { TasksFilter } from '../domain/value-objects/tasks-filter.vo';

@Injectable({ providedIn: 'root' })
export class TasksFacade extends BaseFacade<TasksEntity, TasksFilter> {
    private readonly uiFeedbackService = inject(UiFeedbackService);
    private readonly fetchUseCase = inject(FetchTasksUseCase);

    readonly tasks$: Observable<TasksEntity[]> = this.items$;

    private hasInitialized = false;
    private lastFetchTimestamp = 0;
    private readonly STALE_TIME = 2 * 60 * 1000;

    fetchTasks(filter: TasksFilter, page: string = PAGINATION_CONST.DEFAULT_PAGE, forceRefresh: boolean = false): void {
        const hasData = this.itemsSubject.getValue().length > 0;
        if (!shouldFetch(forceRefresh, hasData, this.lastFetchTimestamp, this.STALE_TIME)) return;

        this.fetchWithFilterAndPage(filter, page, this.fetchUseCase.execute.bind(this.fetchUseCase), this.uiFeedbackService);

        this.hasInitialized = true;
        this.lastFetchTimestamp = Date.now();
    }

    refresh(): void {
        this.filterSubject.next(null);

        const firstPage = PAGINATION_CONST.DEFAULT_PAGE;
        this.pageSubject.next(firstPage);

        this.fetchWithFilterAndPage(null, firstPage, this.fetchUseCase.execute.bind(this.fetchUseCase), this.uiFeedbackService);

        this.lastFetchTimestamp = Date.now();
    }

    changePage(pageNumber: number): void {
        const currentFilter = this.filterSubject.getValue();
        if (!currentFilter) return;

        this.fetchWithFilterAndPage(currentFilter, String(pageNumber), this.fetchUseCase.execute.bind(this.fetchUseCase), this.uiFeedbackService);

        this.lastFetchTimestamp = Date.now();
    }

    refreshWithLastFilterAndPage(): void {
        const currentFilter = this.filterSubject.getValue();
        const currentPage = this.pageSubject.getValue();
        this.fetchWithFilterAndPage(currentFilter, currentPage, this.fetchUseCase.execute.bind(this.fetchUseCase), this.uiFeedbackService);
        this.lastFetchTimestamp = Date.now();
    }
}
