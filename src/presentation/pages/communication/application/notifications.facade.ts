import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseFacade } from '@shared/application/base/base-facade';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { ToastrService } from 'ngx-toastr';
import { Observable, tap } from 'rxjs';
import { NotificationsEntity } from '../domain/entities/notifications.entity';
import { NotificationsUseCase } from '../domain/use-cases/notifications.use-case';
import { NotificationsFilter } from '../domain/value-objects/notifications-filter.vo';

@Injectable({ providedIn: 'root' })
export class NotificationsFacade extends BaseFacade<NotificationsEntity, NotificationsFilter> {
    readonly notifications$: Observable<NotificationsEntity[]> = this.items$;

    private hasInitialized = false;
    private lastFetchTimestamp = 0;
    private readonly STALE_TIME = 2 * 60 * 1000;

    constructor(
        private readonly useCase: NotificationsUseCase,
        toastService: ToastrService,
        translateService: TranslateService
    ) {
        super(toastService, translateService);
    }

    fetchNotifications(
        filter: NotificationsFilter,
        page: string = PAGINATION_CONST.DEFAULT_PAGE,
        forceRefresh: boolean = false
    ): void {
        if (!this.shouldFetch(forceRefresh)) {
            return;
        }
        const fetch = this.useCase.execute(filter, page);
        this.fetchData(filter, page, fetch);

        this.hasInitialized = true;
        this.lastFetchTimestamp = Date.now();
    }

    changePage(pageNumber: number): void {
        const currentFilter = this.filterSubject.getValue();
        if (!currentFilter) {
            return;
        }
        const fetch = this.useCase.execute(
            currentFilter,
            String(pageNumber)
        );
        this.changePageInternal(pageNumber, fetch);

        this.lastFetchTimestamp = Date.now();
    }

    refresh(): void {
        const currentFilter = this.filterSubject.getValue();
        if (!currentFilter) {
            return;
        }
        const currentPage = this.pageSubject.getValue();
        const fetch = this.useCase.execute(currentFilter, currentPage);
        this.fetchData(currentFilter, currentPage, fetch);

        this.lastFetchTimestamp = Date.now();
    }

    private shouldFetch(forceRefresh: boolean): boolean {
        if (forceRefresh) {
            return true;
        }
        if (!this.hasInitialized) {
            return true;
        }
        const isStale = Date.now() - this.lastFetchTimestamp > this.STALE_TIME;
        if (isStale) {
            console.log('🕐 [AllFacade] Data is stale, refetching');
            return true;
        }
        const hasData = this.itemsSubject.getValue().length > 0;
        if (!hasData) {
            return true;
        }

        return false;
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
            hasData: this.itemsSubject.getValue().length > 0,
        };
    }



    readOne(
        payload: string,
    ): Observable<void> {
        return this.useCase.executeReadOne(payload).pipe(
            tap(() => {
                this.toastService.success(
                    this.translateService.instant(
                        'COMMUNICATION.NOTIFICATIONS.SUCCESS.READ'
                    )
                );
                this.refresh();
            })
        );
    }

    readAll(
        payload: string[],
    ): Observable<void> {
        return this.useCase.executeReadAll(payload).pipe(
            tap(() => {
                this.toastService.success(
                    this.translateService.instant(
                        'COMMUNICATION.NOTIFICATIONS.SUCCESS.READ'
                    )
                );
                this.refresh();
            })
        );
    }
}
