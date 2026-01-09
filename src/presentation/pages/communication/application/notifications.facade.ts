import { inject, Injectable } from '@angular/core';
import { BaseFacade } from '@shared/application/base/base-facade';
import { handleObservableWithFeedback, shouldFetch } from '@shared/application/base/facade.utils';
import { UiFeedbackService } from '@shared/application/ui/ui-feedback.service';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { Observable } from 'rxjs';
import { NotificationsEntity } from '../domain/entities/notifications.entity';
import { NotificationsUseCase } from '../domain/use-cases/notifications.use-case';
import { NotificationsFilter } from '../domain/value-objects/notifications-filter.vo';

@Injectable({ providedIn: 'root' })
export class NotificationsFacade extends BaseFacade<
    NotificationsEntity,
    NotificationsFilter
> {
    readonly notifications$: Observable<NotificationsEntity[]> = this.items$;
    private readonly uiFeedbackService = inject(UiFeedbackService);
    private readonly fetchUseCase = inject(NotificationsUseCase);

    private hasInitialized = false;
    private lastFetchTimestamp = 0;
    private readonly STALE_TIME = 2 * 60 * 1000;

    private handleActionWithRefresh<T>(observable: Observable<T>, successKey: string): Observable<T> {
        return handleObservableWithFeedback(observable, this.uiFeedbackService, successKey, () => this.refresh());
    }

    fetchNotifications(filter: NotificationsFilter, page: string = PAGINATION_CONST.DEFAULT_PAGE, forceRefresh: boolean = false): void {
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

    resetMemory(): void {
        this.hasInitialized = false;
        this.lastFetchTimestamp = 0;
        this.reset();
    }

    readOne(payload: string): Observable<void> {
        return this.handleActionWithRefresh(this.fetchUseCase.executeReadOne(payload), 'COMMON.SUCCESS.READ');
    }

    readAll(payload: string[]): Observable<void> {
        return this.handleActionWithRefresh(this.fetchUseCase.executeReadAll(payload), 'COMMON.SUCCESS.READ');
    }
}
