import { inject, Injectable, signal } from '@angular/core';
import { MunicipalitiesCreateCommand } from '@pages/administrative-boundary/application/commands/municipalities/municipalities-create.command';
import { MunicipalitiesDeleteCommand } from '@pages/administrative-boundary/application/commands/municipalities/municipalities-delete.command';
import { MunicipalitiesUpdateCommand } from '@pages/administrative-boundary/application/commands/municipalities/municipalities-update.command';
import { MunicipalitiesCreateBus } from '@pages/administrative-boundary/application/commands-bus/municipalities/municipalities-create.bus';
import { MunicipalitiesDeleteBus } from '@pages/administrative-boundary/application/commands-bus/municipalities/municipalities-delete.bus';
import { MunicipalitiesUpdateBus } from '@pages/administrative-boundary/application/commands-bus/municipalities/municipalities-update.bus';
import { MunicipalitiesCreateDto } from '@pages/administrative-boundary/application/dto/municipalities/municipalities-create.dto';
import { MunicipalitiesDeleteDto } from '@pages/administrative-boundary/application/dto/municipalities/municipalities-delete.dto';
import { MunicipalitiesFilterDto } from '@pages/administrative-boundary/application/dto/municipalities/municipalities-filter.dto';
import { MunicipalitiesUpdateDto } from '@pages/administrative-boundary/application/dto/municipalities/municipalities-update.dto';
import { MunicipalitiesQuery } from '@pages/administrative-boundary/application/queries/municipalities/municipalities.query';
import { MunicipalitiesBus } from '@pages/administrative-boundary/application/queries-bus/municipalities/municipalities.bus';
import { MunicipalitiesEntity } from '@pages/administrative-boundary/domain/entities/municipalities/municipalities.entity';
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
export class MunicipalitiesFacade extends BaseFacade<
    MunicipalitiesEntity,
    MunicipalitiesFilterDto
> {
    private readonly uiFeedbackService = inject(UiFeedbackService);
    private readonly filterBus = inject(MunicipalitiesBus);
    private readonly createBus = inject(MunicipalitiesCreateBus);
    private readonly updateBus = inject(MunicipalitiesUpdateBus);
    private readonly deleteBus = inject(MunicipalitiesDeleteBus);

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
        filter: MunicipalitiesFilterDto,
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
        const command = new MunicipalitiesQuery(
            filter?.search,
            filter?.region,
            filter?.department,
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
        filter: MunicipalitiesFilterDto | null,
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
        filter: MunicipalitiesFilterDto | null
    ): MunicipalitiesQuery {
        return new MunicipalitiesQuery(
            filter?.search ?? null,
            filter?.region ?? null,
            filter?.department ?? null,
            filter?.startDate ?? null,
            filter?.endDate ?? null
        );
    }

    create(dto: MunicipalitiesCreateDto): void {
        const command = new MunicipalitiesCreateCommand(
            dto.code,
            dto.name,
            dto.region,
            dto.description,
            dto.department
        );
        this.executeAction(
            this.createBus.dispatch(command),
            'COMMON.SUCCESS.CREATE'
        ).subscribe();
    }

    update(dto: MunicipalitiesUpdateDto): void {
        const command = new MunicipalitiesUpdateCommand(
            dto.uniqId,
            dto.code,
            dto.name,
            dto.region,
            dto.description,
            dto.department
        );
        this.executeAction(
            this.updateBus.dispatch(command),
            'COMMON.SUCCESS.UPDATE'
        ).subscribe();
    }

    delete(dto: MunicipalitiesDeleteDto): void {
        const command = new MunicipalitiesDeleteCommand(dto.uniqId);
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
