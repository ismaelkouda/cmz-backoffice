import { computed, inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NotificationsReadOneCommand } from '@pages/communication/application/commands/notifications/notifications-read-one.command';
import { NotificationsReadAllBus } from '@pages/communication/application/commands-bus/notifications/notifications-read-all.bus';
import { NotificationsReadOneBus } from '@pages/communication/application/commands-bus/notifications/notifications-read-one.bus';
import { NotificationsFilterDto } from '@pages/communication/application/dto/notifications/notifications-filter.dto';
import { NotificationsReadOneDto } from '@pages/communication/application/dto/notifications/notifications-read-one.dto';
import { NotificationsQuery } from '@pages/communication/application/queries/notifications/notifications.query';
import { NotificationsBus } from '@pages/communication/application/queries-bus/notifications/notifications.bus';
import { NotificationsEntity } from '@pages/communication/domain/entities/notifications/notifications.entity';
import { Status } from '@pages/communication/domain/enums/notifications/notifications-status.enum';
import { BaseFacade } from '@shared/application/services/base-facade';
import {
    handleObservableWithFeedback,
    shouldFetch,
} from '@shared/application/services/facade.utils';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class NotificationsFacade extends BaseFacade<
    NotificationsEntity,
    NotificationsFilterDto
> {
    private readonly uiFeedbackService = inject(UiFeedbackService);
    private readonly filterBus = inject(NotificationsBus);
    private readonly readAllBus = inject(NotificationsReadAllBus);
    private readonly readOneBus = inject(NotificationsReadOneBus);

    private readonly _actionState = signal<'idle' | 'loading'>('idle');
    readonly actionState = this._actionState.asReadonly();

    private readonly _actionSuccess = signal(0);
    readonly actionSuccess = this._actionSuccess.asReadonly();

    private readonly _actionError = signal<unknown | null>(null);
    readonly actionError = this._actionError.asReadonly();

    readonly items = toSignal(this.items$, { initialValue: [] });

    readonly unreadCount = computed(
        () => this.items().filter((n) => n.status === Status.UNREAD).length
    );

    private hasInitialized = false;
    private lastFetchTimestamp = 0;
    private readonly STALE_TIME = 2 * 60 * 1000;

    private handleActionWithRefresh<T>(
        observable: Observable<T>,
        successKey?: string
    ): Observable<T> {
        return handleObservableWithFeedback(
            observable,
            this.uiFeedbackService,
            successKey,
            () => this.refresh()
        );
    }

    execute(
        filter: NotificationsFilterDto = {},
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

        const command = new NotificationsQuery(
            filter?.search,
            filter?.type,
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
        const command = new NotificationsQuery(
            filter?.search,
            filter?.type,
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
        const command = new NotificationsQuery(
            filter?.search,
            filter?.type,
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
        const command = new NotificationsQuery(
            filter?.search,
            filter?.type,
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

    readOne(team: NotificationsReadOneDto): void {
        const command = new NotificationsReadOneCommand(team.uniqId);
        this.handleActionWithRefresh(
            this.readOneBus.dispatch(command)
        ).subscribe();
    }

    readAll(): void {
        this.handleActionWithRefresh(
            this.readAllBus.dispatch(),
            'COMMON.SUCCESS.READ'
        ).subscribe();
    }
}
