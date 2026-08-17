import { inject, Injectable, signal } from '@angular/core';
import { MunicipalitiesByDepartmentIdFilterDto } from '@pages/administrative-boundary/application/dto/departments/municipalities-by-department-id-filter.dto';
import { MunicipalitiesByDepartmentIdQuery } from '@pages/administrative-boundary/application/queries/departments/municipalities-by-department-id.query';
import { MunicipalitiesByDepartmentIdBus } from '@pages/administrative-boundary/application/queries-bus/departments/municipalities-by-department-id.bus';
import { MunicipalitiesByDepartmentIdEntity } from '@pages/administrative-boundary/domain/entities/departments/municipalities-by-department-id.entity';
import { BaseFacade } from '@shared/application/services/base-facade';

import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class MunicipalitiesByDepartmentIdFacade extends BaseFacade<
    MunicipalitiesByDepartmentIdEntity,
    MunicipalitiesByDepartmentIdFilterDto
> {
    private readonly uiFeedback = inject(UiFeedbackService);
    private readonly filterBus = inject(MunicipalitiesByDepartmentIdBus);

    private readonly _actionState = signal<'idle' | 'loading'>('idle');
    readonly actionState = this._actionState.asReadonly();

    private readonly _actionSuccess = signal(0);
    readonly actionSuccess = this._actionSuccess.asReadonly();

    private readonly _actionError = signal<unknown | null>(null);
    readonly actionError = this._actionError.asReadonly();

    private hasInitialized = false;
    private lastFetchTimestamp = 0;

    execute(
        filter: MunicipalitiesByDepartmentIdFilterDto,
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
        filter: MunicipalitiesByDepartmentIdFilterDto | null,
        page: string,
        options: FetchOptions = {}
    ): void {
        const query = this.buildQuery(filter);
        const fetch$ = this.filterBus.dispatch(query, page, options);
        this.fetchWithFilterAndPage(filter, page, fetch$, this.uiFeedback);
        this.lastFetchTimestamp = Date.now();
    }

    private buildQuery(
        filter?: MunicipalitiesByDepartmentIdFilterDto | null
    ): MunicipalitiesByDepartmentIdQuery {
        return new MunicipalitiesByDepartmentIdQuery(
            filter?.uniqId ?? '',
            filter?.search,
            filter?.region,
            filter?.department,
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
