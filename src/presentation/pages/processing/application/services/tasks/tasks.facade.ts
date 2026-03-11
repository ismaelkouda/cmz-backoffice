import { inject, Injectable } from '@angular/core';
import { TasksFilterDto } from '@pages/processing/application/dto/tasks/tasks-filter.dto';
import { TasksQuery } from '@pages/processing/application/queries/tasks/tasks.query';
import { TasksBus } from '@pages/processing/application/queries-bus/tasks/tasks.bus';
import { TasksEntity } from '@pages/processing/domain/entities/tasks/tasks.entity';
import { BaseFacade } from '@shared/application/services/base-facade';
import { shouldFetch } from '@shared/application/services/facade.utils';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';

@Injectable({ providedIn: 'root' })
export class TasksFacade extends BaseFacade<TasksEntity, TasksFilterDto> {
    private readonly uiFeedbackService = inject(UiFeedbackService);
    private readonly filterBus = inject(TasksBus);

    private hasInitialized = false;
    private lastFetchTimestamp = 0;
    private readonly STALE_TIME = 2 * 60 * 1000;

    read(
        filter: TasksFilterDto = {},
        page: string = PAGINATION_CONST.DEFAULT_PAGE,
        forceRefresh = false
    ): void {
        const hasData = this.itemsSubject.getValue().length > 0;
        if (
            !shouldFetch(
                forceRefresh,
                hasData,
                this.lastFetchTimestamp,
                this.STALE_TIME
            )
        ) {
            return;
        }

        const command = new TasksQuery(
            filter?.initiatorPhoneNumber,
            filter?.uniqId,
            filter?.reportType,
            filter?.operators,
            filter?.source,
            filter?.startDate,
            filter?.endDate
        );
        const fetch$ = this.filterBus.dispatch(command, page);
        this.fetchWithFilterAndPage(
            filter,
            page,
            fetch$,
            this.uiFeedbackService
        );

        this.hasInitialized = true;
        this.lastFetchTimestamp = Date.now();
    }

    refresh(): void {
        this.filterSubject.next(null);
        this.pageSubject.next(PAGINATION_CONST.DEFAULT_PAGE);
        const filter = this.filterSubject.getValue();
        const page = this.pageSubject.getValue();
        const command = new TasksQuery(
            filter?.initiatorPhoneNumber,
            filter?.uniqId,
            filter?.reportType,
            filter?.operators,
            filter?.source,
            filter?.startDate,
            filter?.endDate
        );
        const fetch$ = this.filterBus.dispatch(command, page);
        this.fetchWithFilterAndPage(null, page, fetch$, this.uiFeedbackService);
        this.lastFetchTimestamp = Date.now();
    }

    changePage(page: string): void {
        const filter = this.filterSubject.getValue();
        if (!filter) {
            return;
        }
        const command = new TasksQuery(
            filter?.initiatorPhoneNumber,
            filter?.uniqId,
            filter?.reportType,
            filter?.operators,
            filter?.source,
            filter?.startDate,
            filter?.endDate
        );
        const fetch$ = this.filterBus.dispatch(command, page);
        this.fetchWithFilterAndPage(
            filter,
            page,
            fetch$,
            this.uiFeedbackService
        );
        this.lastFetchTimestamp = Date.now();
    }

    refreshWithLastFilterAndPage(): void {
        const filter = this.filterSubject.getValue();
        const page = this.pageSubject.getValue();
        const command = new TasksQuery(
            filter?.initiatorPhoneNumber,
            filter?.uniqId,
            filter?.reportType,
            filter?.operators,
            filter?.source,
            filter?.startDate,
            filter?.endDate
        );
        const fetch$ = this.filterBus.dispatch(command, page);
        this.fetchWithFilterAndPage(
            filter,
            page,
            fetch$,
            this.uiFeedbackService
        );
        this.lastFetchTimestamp = Date.now();
    }

    resetMemory(): void {
        this.hasInitialized = false;
        this.lastFetchTimestamp = 0;
        this.reset();
    }

    getMemoryStatus(): {
        hasInitialized: boolean;
        lastFetch: number;
        hasData: boolean;
    } {
        return {
            hasInitialized: this.hasInitialized,
            lastFetch: this.lastFetchTimestamp,
            hasData: this.itemsSubject.getValue() !== null,
        };
    }
}
