/* import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseFacade } from '@shared/application/base/base-facade';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { ToastrService } from 'ngx-toastr';
import { catchError, debounceTime, finalize, Observable, throwError } from 'rxjs';
import { NotificationsEntity } from '../domain/entities/notifications.entity';
import { NotificationsUseCase } from '../domain/use-cases/notifications.use-case';
import { NotificationsFilter } from '../domain/value-objects/notifications-filter.vo';
import { ɵFormGroupRawValue, ɵTypedOrUntyped } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class NotificationsFacade extends BaseFacade<NotificationsEntity, any> {
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
        credentials: ɵTypedOrUntyped<
            string,
            ɵFormGroupRawValue<string>,
            any
        >,
        endPointType: EndPointType
    ): Observable<void> {
        const payload = credentials;
        if (this.loadingSubject.getValue()) {
            return throwError(() => new Error('Operation already in progress'));
        }
        this.loadingSubject.next(true);
        return this.useCase
            .executeReadOne(payload)
            .pipe(
                debounceTime(PAGINATION_CONST.DEBOUNCE_TIME_MS),
                finalize(() => this.loadingSubject.next(false)),
                catchError((error: unknown) => {
                    const errorMessage = this.getErrorMessage(error);
                    this.toastService.error(errorMessage);
                    return throwError(() => error);
                })
            );
    }

    readAll(
        credentials: ɵTypedOrUntyped<
            string[],
            ɵFormGroupRawValue<string[]>,
            any
        >,
    ): Observable<void> {
        const payload = credentials;
        if (this.loadingSubject.getValue()) {
            return throwError(() => new Error('Operation already in progress'));
        }
        this.loadingSubject.next(true);
        return this.useCase
            .executeReadAll(payload)
            .pipe(
                debounceTime(PAGINATION_CONST.DEBOUNCE_TIME_MS),
                finalize(() => this.loadingSubject.next(false)),
                catchError((error: unknown) => {
                    const errorMessage = this.getErrorMessage(error);
                    this.toastService.error(errorMessage);
                    return throwError(() => error);
                })
            );
    }
}
 */