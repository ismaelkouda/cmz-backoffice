import { inject, Injectable, signal } from '@angular/core';
import { TasksActionsCreateCommand } from '@pages/processing/application/commands/tasks/tasks-actions-create.command';
import { TasksActionsDeleteCommand } from '@pages/processing/application/commands/tasks/tasks-actions-delete.command';
import { TasksActionsUpdateCommand } from '@pages/processing/application/commands/tasks/tasks-actions-update.command';
import { TasksActionsCreateBus } from '@pages/processing/application/commands-bus/tasks/tasks-actions-create.bus';
import { TasksActionsDeleteBus } from '@pages/processing/application/commands-bus/tasks/tasks-actions-delete.bus';
import { TasksActionsUpdateBus } from '@pages/processing/application/commands-bus/tasks/tasks-actions-update.bus';
import { TasksActionsCreateDto } from '@pages/processing/application/dto/tasks/tasks-actions-create.dto';
import { TasksActionsDeleteDto } from '@pages/processing/application/dto/tasks/tasks-actions-delete.dto';
import { TasksActionsFilterDto } from '@pages/processing/application/dto/tasks/tasks-actions-filter.dto';
import { TasksActionsUpdateDto } from '@pages/processing/application/dto/tasks/tasks-actions-update.dto';
import { TasksActionsQuery } from '@pages/processing/application/queries/tasks/tasks-actions.query';
import { TasksActionsBus } from '@pages/processing/application/queries-bus/tasks/tasks-actions.bus';
import { TasksActionsEntity } from '@pages/processing/domain/entities/tasks/tasks-actions.entity';
import { BaseFacade } from '@shared/application/services/base-facade';
import { handleObservableWithFeedback } from '@shared/application/services/facade.utils';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class TasksActionsFacade extends BaseFacade<
    TasksActionsEntity,
    TasksActionsFilterDto
> {
    private readonly uiFeedback = inject(UiFeedbackService);
    private readonly filterBus = inject(TasksActionsBus);
    private readonly createBus = inject(TasksActionsCreateBus);
    private readonly updateBus = inject(TasksActionsUpdateBus);
    private readonly deleteBus = inject(TasksActionsDeleteBus);

    private readonly _actionState = signal<'idle' | 'loading'>('idle');
    readonly actionState = this._actionState.asReadonly();

    private readonly _actionSuccess = signal(0);
    readonly actionSuccess = this._actionSuccess.asReadonly();

    private readonly _actionError = signal<unknown | null>(null);
    readonly actionError = this._actionError.asReadonly();

    private hasInitialized = false;
    private lastFetchTimestamp = 0;

    private handleActionWithRefresh<T>(
        observable: Observable<T>,
        successKey: string
    ): Observable<T> {
        return handleObservableWithFeedback(
            observable,
            this.uiFeedback,
            successKey,
            () => this.refresh()
        );
    }

    readAll(
        filter: TasksActionsFilterDto,
        page: string = PAGINATION_CONST.DEFAULT_PAGE,
        options: FetchOptions = {}
    ): void {
        const command = new TasksActionsQuery(filter.uniqId);
        const fetch$ = this.filterBus.dispatch(command, page, options);
        this.fetchWithFilterAndPage(filter, page, fetch$, this.uiFeedback);

        this.hasInitialized = true;
        this.lastFetchTimestamp = Date.now();
    }

    refresh(): void {
        this.pageSubject.next(PAGINATION_CONST.DEFAULT_PAGE);
        const filter = this.filterSubject.getValue();
        const page = this.pageSubject.getValue();
        const command = new TasksActionsQuery(filter?.uniqId ?? '');
        const fetch$ = this.filterBus.dispatch(command, page, {
            forceRefresh: true,
        });
        this.fetchWithFilterAndPage(filter, page, fetch$, this.uiFeedback);
        this.lastFetchTimestamp = Date.now();
    }

    changePage(page: string): void {
        const filter = this.filterSubject.getValue();
        if (!filter) {
            return;
        }
        const command = new TasksActionsQuery(filter.uniqId);
        const fetch$ = this.filterBus.dispatch(command, page);
        this.fetchWithFilterAndPage(filter, page, fetch$, this.uiFeedback);
        this.lastFetchTimestamp = Date.now();
    }

    refreshWithLastFilterAndPage(): void {
        const filter = this.filterSubject.getValue();
        const page = this.pageSubject.getValue();
        const filterData = filter ? filter.uniqId : '';
        const command = new TasksActionsQuery(filterData);
        const fetch$ = this.filterBus.dispatch(command, page, {
            forceRefresh: true,
        });
        this.fetchWithFilterAndPage(filter, page, fetch$, this.uiFeedback);
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

    create(action: TasksActionsCreateDto): void {
        this._actionState.set('loading');

        const command = new TasksActionsCreateCommand(
            action.reportUniqId,
            action.date,
            action.type,
            action.operator,
            action.description,
            action.shouldNotifyUser,
            action.isConform
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

    update(action: TasksActionsUpdateDto): void {
        this._actionState.set('loading');

        const command = new TasksActionsUpdateCommand(
            action.uniqId,
            action.reportUniqId,
            action.date,
            action.type,
            action.operator,
            action.description,
            action.shouldNotifyUser,
            action.isConform
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

    delete(action: TasksActionsDeleteDto): void {
        const command = new TasksActionsDeleteCommand(action.uniqId);
        this.handleActionWithRefresh(
            this.deleteBus.dispatch(command),
            'COMMON.SUCCESS.DELETE'
        ).subscribe();
    }
}
