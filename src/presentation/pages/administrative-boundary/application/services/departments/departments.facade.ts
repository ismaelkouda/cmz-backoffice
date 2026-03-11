import { inject, Injectable, signal } from '@angular/core';
import { DepartmentsCreateCommand } from '@pages/administrative-boundary/application/commands/departments/departments-create.command';
import { DepartmentsDeleteCommand } from '@pages/administrative-boundary/application/commands/departments/departments-delete.command';
import { DepartmentsUpdateCommand } from '@pages/administrative-boundary/application/commands/departments/departments-update.command';
import { DepartmentsCreateBus } from '@pages/administrative-boundary/application/commands-bus/departments/departments-create.bus';
import { DepartmentsDeleteBus } from '@pages/administrative-boundary/application/commands-bus/departments/departments-delete.bus';
import { DepartmentsUpdateBus } from '@pages/administrative-boundary/application/commands-bus/departments/departments-update.bus';
import { DepartmentsCreateDto } from '@pages/administrative-boundary/application/dto/departments/departments-create.dto';
import { DepartmentsDeleteDto } from '@pages/administrative-boundary/application/dto/departments/departments-delete.dto';
import { DepartmentsFilterDto } from '@pages/administrative-boundary/application/dto/departments/departments-filter.dto';
import { DepartmentsUpdateDto } from '@pages/administrative-boundary/application/dto/departments/departments-update.dto';
import { DepartmentsQuery } from '@pages/administrative-boundary/application/queries/departments/departments.query';
import { DepartmentsBus } from '@pages/administrative-boundary/application/queries-bus/departments/departments.bus';
import { DepartmentsEntity } from '@pages/administrative-boundary/domain/entities/departments/departments.entity';
import { BaseFacade } from '@shared/application/services/base-facade';
import {
    handleObservableWithFeedback,
    shouldFetch,
} from '@shared/application/services/facade.utils';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DepartmentsFacade extends BaseFacade<
    DepartmentsEntity,
    DepartmentsFilterDto
> {
    private readonly uiFeedbackService = inject(UiFeedbackService);
    private readonly filterBus = inject(DepartmentsBus);
    private readonly createBus = inject(DepartmentsCreateBus);
    private readonly updateBus = inject(DepartmentsUpdateBus);
    private readonly deleteBus = inject(DepartmentsDeleteBus);

    private readonly _actionState = signal<'idle' | 'loading'>('idle');
    readonly actionState = this._actionState.asReadonly();

    private readonly _actionSuccess = signal(0);
    readonly actionSuccess = this._actionSuccess.asReadonly();

    private readonly _actionError = signal<unknown | null>(null);
    readonly actionError = this._actionError.asReadonly();

    private hasInitialized = false;
    private lastFetchTimestamp = 0;
    private readonly STALE_TIME = 2 * 60 * 1000;

    private handleActionWithRefresh<T>(
        observable: Observable<T>,
        successKey: string
    ): Observable<T> {
        return handleObservableWithFeedback(
            observable,
            this.uiFeedbackService,
            successKey,
            () => this.refresh()
        );
    }

    readAll(
        filter: DepartmentsFilterDto = {},
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

        const command = new DepartmentsQuery(
            filter?.search,
            filter?.region,
            filter?.municipality,
            filter?.status,
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
        const command = new DepartmentsQuery(
            filter?.search,
            filter?.region,
            filter?.municipality,
            filter?.status,
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
        const command = new DepartmentsQuery(
            filter?.search,
            filter?.region,
            filter?.municipality,
            filter?.status,
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
        const command = new DepartmentsQuery(
            filter?.search,
            filter?.region,
            filter?.municipality,
            filter?.status,
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

    create(participant: DepartmentsCreateDto): void {
        this._actionState.set('loading');

        const command = new DepartmentsCreateCommand(
            participant.code,
            participant.name,
            participant.region,
            participant.description
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

    update(participant: DepartmentsUpdateDto): void {
        this._actionState.set('loading');
        const command = new DepartmentsUpdateCommand(
            participant.uniqId,
            participant.code,
            participant.name,
            participant.region,
            participant.description
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

    delete(team: DepartmentsDeleteDto): void {
        const command = new DepartmentsDeleteCommand(team.uniqId);
        this.handleActionWithRefresh(
            this.deleteBus.dispatch(command),
            'COMMON.SUCCESS.DELETE'
        ).subscribe();
    }
}
