import { inject, Injectable, signal } from '@angular/core';
import { MessagingCreateCommand } from '@pages/communication/application/commands/messaging/messaging-create.command';
import { MessagingDeleteCommand } from '@pages/communication/application/commands/messaging/messaging-delete.command';
import { MessagingDisableCommand } from '@pages/communication/application/commands/messaging/messaging-disable.command';
import { MessagingEnableCommand } from '@pages/communication/application/commands/messaging/messaging-enable.command';
import { MessagingUpdateCommand } from '@pages/communication/application/commands/messaging/messaging-update.command';
import { MessagingCreateBus } from '@pages/communication/application/commands-bus/messaging/messaging-create.bus';
import { MessagingDeleteBus } from '@pages/communication/application/commands-bus/messaging/messaging-delete.bus';
import { MessagingDisableBus } from '@pages/communication/application/commands-bus/messaging/messaging-disable.bus';
import { MessagingEnableBus } from '@pages/communication/application/commands-bus/messaging/messaging-enable.bus';
import { MessagingUpdateBus } from '@pages/communication/application/commands-bus/messaging/messaging-update.bus';
import { MessagingCreateDto } from '@pages/communication/application/dto/messaging/messaging-create.dto';
import { MessagingDeleteDto } from '@pages/communication/application/dto/messaging/messaging-delete.dto';
import { MessagingDisableDto } from '@pages/communication/application/dto/messaging/messaging-disable.dto';
import { MessagingEnableDto } from '@pages/communication/application/dto/messaging/messaging-enable.dto';
import { MessagingFilterDto } from '@pages/communication/application/dto/messaging/messaging-filter.dto';
import { MessagingUpdateDto } from '@pages/communication/application/dto/messaging/messaging-update.dto';
import { MessagingQuery } from '@pages/communication/application/queries/messaging/messaging.query';
import { MessagingBus } from '@pages/communication/application/queries-bus/messaging/messaging.bus';
import { MessagingEntity } from '@pages/communication/domain/entities/messaging/messaging.entity';
import { BaseFacade } from '@shared/application/services/base-facade';
import { handleObservableWithFeedback } from '@shared/application/services/facade.utils';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class MessagingFacade extends BaseFacade<
    MessagingEntity,
    MessagingFilterDto
> {
    private readonly uiFeedback = inject(UiFeedbackService);
    private readonly filterBus = inject(MessagingBus);
    private readonly createBus = inject(MessagingCreateBus);
    private readonly updateBus = inject(MessagingUpdateBus);
    private readonly enableBus = inject(MessagingEnableBus);
    private readonly disableBus = inject(MessagingDisableBus);
    private readonly deleteBus = inject(MessagingDeleteBus);

    private readonly _actionState = signal<'idle' | 'loading'>('idle');
    readonly actionState = this._actionState.asReadonly();

    private readonly _actionSuccess = signal(0);
    readonly actionSuccess = this._actionSuccess.asReadonly();

    private readonly _actionError = signal<unknown | null>(null);
    readonly actionError = this._actionError.asReadonly();

    private hasInitialized = false;
    private lastFetchTimestamp = 0;

    readAll(
        filter: MessagingFilterDto = {},
        page = PAGINATION_CONST.DEFAULT_PAGE,
        options: FetchOptions = {}
    ): void {
        this.executeQuery(filter, page, options);
        this.hasInitialized = true;
    }

    refresh(): void {
        this.filterSubject.next(null);
        this.pageSubject.next(PAGINATION_CONST.DEFAULT_PAGE);
        this.executeQuery(null, this.pageSubject.getValue(), {
            forceRefresh: true,
        });
    }

    changePage(page: string): void {
        const filter = this.filterSubject.getValue();
        if (!filter) {
            return;
        }
        this.executeQuery(filter, page);
    }

    refreshWithLastFilterAndPage(): void {
        this.executeQuery(
            this.filterSubject.getValue(),
            this.pageSubject.getValue()
        );
    }

    private executeQuery(
        filter: MessagingFilterDto | null,
        page: string,
        options: FetchOptions = {}
    ): void {
        const query = this.buildQuery(filter ?? undefined);
        const fetch$ = this.filterBus.dispatch(query, page, options);
        this.fetchWithFilterAndPage(filter, page, fetch$, this.uiFeedback);
        this.lastFetchTimestamp = Date.now();
    }

    private buildQuery(filter?: MessagingFilterDto | null): MessagingQuery {
        return new MessagingQuery(
            filter?.search,
            filter?.reportId,
            filter?.targetType,
            filter?.region,
            filter?.department,
            filter?.municipality,
            filter?.channels,
            filter?.startDate,
            filter?.endDate
        );
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

    create(messaging: MessagingCreateDto): void {
        this._actionState.set('loading');

        const command = new MessagingCreateCommand(
            messaging?.reportId,
            messaging?.type,
            messaging?.targetType,
            messaging?.region,
            messaging?.department,
            messaging?.municipality,
            messaging?.channels,
            messaging?.subject,
            messaging?.content
        );

        this.handleActionWithRefresh(
            this.createBus.dispatch(command),
            'COMMON.SUCCESS.CREATE'
        )
            .pipe(
                tap(() => {
                    this._actionSuccess.update((v) => v + 1);
                }),
                catchError((err) => {
                    this._actionError.set(err);
                    return throwError(() => err);
                }),
                finalize(() => this._actionState.set('idle'))
            )
            .subscribe();
    }

    update(messaging: MessagingUpdateDto): void {
        this._actionState.set('loading');
        const command = new MessagingUpdateCommand(
            messaging.uniqId,
            messaging.reportId,
            messaging.type,
            messaging.targetType,
            messaging.region,
            messaging.department,
            messaging.municipality,
            messaging.channels,
            messaging.subject,
            messaging.content
        );
        this.handleActionWithRefresh(
            this.updateBus.dispatch(command),
            'COMMON.SUCCESS.UPDATE'
        )
            .pipe(
                tap(() => {
                    this._actionSuccess.update((v) => v + 1);
                }),
                catchError((err) => {
                    this._actionError.set(err);
                    return throwError(() => err);
                }),
                finalize(() => this._actionState.set('idle'))
            )
            .subscribe();
    }

    enable(team: MessagingEnableDto): void {
        const command = new MessagingEnableCommand(team.uniqId);
        this.handleActionWithRefresh(
            this.enableBus.dispatch(command),
            'COMMON.SUCCESS.UPDATE'
        );
    }

    disable(team: MessagingDisableDto): void {
        const command = new MessagingDisableCommand(team.uniqId);
        this.handleActionWithRefresh(
            this.disableBus.dispatch(command),
            'COMMON.SUCCESS.UPDATE'
        );
    }

    delete(team: MessagingDeleteDto): void {
        const command = new MessagingDeleteCommand(team.uniqId);
        this.handleActionWithRefresh(
            this.deleteBus.dispatch(command),
            'COMMON.SUCCESS.DELETE'
        );
    }

    private handleActionWithRefresh<T>(
        observable: Observable<T>,
        successKey: string
    ): Observable<T> {
        return handleObservableWithFeedback(
            observable,
            this.uiFeedback,
            successKey,
            () => this.refreshWithLastFilterAndPage()
        );
    }
}
