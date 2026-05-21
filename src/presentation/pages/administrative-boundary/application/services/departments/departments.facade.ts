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

    readAll(
        filter: DepartmentsFilterDto,
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
        this.performFetch(filter, page);
        this.hasInitialized = true;
    }

    refresh(): void {
        this.filterSubject.next(null);
        this.pageSubject.next(PAGINATION_CONST.DEFAULT_PAGE);
        const filter = this.filterSubject.getValue();
        const page = this.pageSubject.getValue();
        this.performFetch(filter, page);
    }

    changePage(page: string): void {
        const filter = this.filterSubject.getValue();
        if (!filter) {
            return;
        }
        const command = new DepartmentsQuery(
            filter?.search,
            filter?.region,
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
        if (filter) {
            this.performFetch(filter, page);
        }
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

    private performFetch(
        filter: DepartmentsFilterDto | null,
        page: string
    ): void {
        const query = this.buildQueryFromFilter(filter);
        const fetch$ = this.filterBus.dispatch(query, page);
        this.fetchWithFilterAndPage(
            filter,
            page,
            fetch$,
            this.uiFeedbackService
        );
        this.lastFetchTimestamp = Date.now();
    }
    private buildQueryFromFilter(
        filter: DepartmentsFilterDto | null
    ): DepartmentsQuery {
        return new DepartmentsQuery(
            filter?.search ?? null,
            filter?.region ?? null,
            filter?.startDate ?? null,
            filter?.endDate ?? null
        );
    }

    create(dto: DepartmentsCreateDto): void {
        const command = new DepartmentsCreateCommand(
            dto.code,
            dto.name,
            dto.region,
            dto.description
        );
        this.executeAction(
            this.createBus.dispatch(command),
            'COMMON.SUCCESS.CREATE'
        ).subscribe();
    }

    update(dto: DepartmentsUpdateDto): void {
        const command = new DepartmentsUpdateCommand(
            dto.uniqId,
            dto.code,
            dto.name,
            dto.region,
            dto.description
        );
        this.executeAction(
            this.updateBus.dispatch(command),
            'COMMON.SUCCESS.UPDATE'
        ).subscribe();
    }

    delete(dto: DepartmentsDeleteDto): void {
        const command = new DepartmentsDeleteCommand(dto.uniqId);
        this.executeAction(
            this.deleteBus.dispatch(command),
            'COMMON.SUCCESS.DELETE',
            false
        ).subscribe();
    }

    private executeAction<T>(
        observable: Observable<T>,
        successKey: string,
        trackState = true
    ): Observable<T> {
        if (trackState) {
            this._actionState.set('loading');
        }

        return handleObservableWithFeedback(
            observable,
            this.uiFeedbackService,
            successKey,
            () => this.refresh()
        ).pipe(
            tap(() => trackState && this._actionSuccess.update((v) => v + 1)),
            catchError((err) => {
                if (trackState) {
                    this._actionError.set(err);
                }
                return throwError(() => err);
            }),
            finalize(() => trackState && this._actionState.set('idle'))
        );
    }

    resetActionSuccess(): void {
        this._actionSuccess.set(0);
    }
}
