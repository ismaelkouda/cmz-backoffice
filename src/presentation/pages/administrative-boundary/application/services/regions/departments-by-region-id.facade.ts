import { inject, Injectable, signal } from '@angular/core';
import { DepartmentsByRegionIdFilterDto } from '@pages/administrative-boundary/application/dto/regions/departments-by-region-id-filter.dto';
import { DepartmentsByRegionIdQuery } from '@pages/administrative-boundary/application/queries/regions/departments-by-region-id.query';
import { DepartmentsByRegionIdBus } from '@pages/administrative-boundary/application/queries-bus/regions/departments-by-region-id.bus';
import { DepartmentsByRegionIdEntity } from '@pages/administrative-boundary/domain/entities/regions/departments-by-region-id.entity';
import { BaseFacade } from '@shared/application/services/base-facade';

import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class DepartmentsByRegionIdFacade extends BaseFacade<
    DepartmentsByRegionIdEntity,
    DepartmentsByRegionIdFilterDto
> {
    private readonly uiFeedback = inject(UiFeedbackService);
    private readonly filterBus = inject(DepartmentsByRegionIdBus);

    private readonly _actionState = signal<'idle' | 'loading'>('idle');
    readonly actionState = this._actionState.asReadonly();

    private readonly _actionSuccess = signal(0);
    readonly actionSuccess = this._actionSuccess.asReadonly();

    private readonly _actionError = signal<unknown | null>(null);
    readonly actionError = this._actionError.asReadonly();

    private hasInitialized = false;
    private lastFetchTimestamp = 0;

    execute(
        filter: DepartmentsByRegionIdFilterDto,
        page: string = PAGINATION_CONST.DEFAULT_PAGE,
        options: FetchOptions = {}
    ): void {
        this.executeQuery(filter, page, options);
        this.hasInitialized = true;
        this.lastFetchTimestamp = Date.now();
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
            this.pageSubject.getValue(),
            {
                forceRefresh: true,
            }
        );
    }

    private executeQuery(
        filter: DepartmentsByRegionIdFilterDto | null,
        page: string,
        options: FetchOptions = {}
    ): void {
        const query = this.buildQuery(filter);
        const fetch$ = this.filterBus.dispatch(query, page, options);
        this.fetchWithFilterAndPage(filter, page, fetch$, this.uiFeedback);
        this.lastFetchTimestamp = Date.now();
    }

    private buildQuery(
        filter?: DepartmentsByRegionIdFilterDto | null
    ): DepartmentsByRegionIdQuery {
        return new DepartmentsByRegionIdQuery(
            filter?.uniqId,
            filter?.search,
            filter?.municipality,
            filter?.status,
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
}
