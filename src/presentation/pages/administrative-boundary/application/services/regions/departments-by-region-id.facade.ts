import { inject, Injectable, signal } from '@angular/core';

import { BaseFacade } from '@shared/application/services/base-facade';
import { shouldFetch } from '@shared/application/services/facade.utils';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';

import { DepartmentsByRegionIdFilterDto } from '@presentation/pages/administrative-boundary/application/dto/regions/departments-by-region-id-filter.dto';
import { DepartmentsByRegionIdQuery } from '@presentation/pages/administrative-boundary/application/queries/regions/departments-by-region-id.query';
import { DepartmentsByRegionIdBus } from '@presentation/pages/administrative-boundary/application/queries-bus/regions/departments-by-region-id.bus';
import { DepartmentsByRegionIdEntity } from '@presentation/pages/administrative-boundary/domain/entities/regions/departments-by-region-id.entity';

@Injectable({
    providedIn: 'root',
})
export class DepartmentsByRegionIdFacade extends BaseFacade<
    DepartmentsByRegionIdEntity,
    DepartmentsByRegionIdFilterDto
> {
    private readonly uiFeedbackService = inject(UiFeedbackService);
    private readonly filterBus = inject(DepartmentsByRegionIdBus);

    private readonly _actionState = signal<'idle' | 'loading'>('idle');
    readonly actionState = this._actionState.asReadonly();

    private readonly _actionSuccess = signal(0);
    readonly actionSuccess = this._actionSuccess.asReadonly();

    private readonly _actionError = signal<unknown | null>(null);
    readonly actionError = this._actionError.asReadonly();

    private hasInitialized = false;
    private lastFetchTimestamp = 0;
    private readonly STALE_TIME = 2 * 60 * 1000;

    execute(
        filter: DepartmentsByRegionIdFilterDto,
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

        const command = new DepartmentsByRegionIdQuery(
            filter.uniqId,
            filter?.search,
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
        const command = new DepartmentsByRegionIdQuery(
            filter?.uniqId ?? '',
            filter?.search,
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
        const command = new DepartmentsByRegionIdQuery(
            filter?.uniqId ?? '',
            filter?.search,
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
}
