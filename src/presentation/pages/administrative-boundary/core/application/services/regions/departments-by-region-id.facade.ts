import { inject, Injectable } from '@angular/core';
import { BaseFacade } from '@shared/application/base/base-facade';
import { shouldFetch } from '@shared/application/base/facade.utils';
import { UiFeedbackService } from '@shared/application/ui/ui-feedback.service';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { DepartmentsByRegionIdEntity } from '../../../domain/entities/regions/departments-by-region-id.entity';
import { DepartmentsByRegionIdFilterDto } from '../../dtos/regions/departments-by-region-id-filter.dto';
import { DepartmentsByRegionIdUseCase } from '../../use-cases/regions/departments-by-region-id.use-case';

@Injectable({
    providedIn: 'root'
})
export class DepartmentsByRegionIdFacade extends BaseFacade<DepartmentsByRegionIdEntity, DepartmentsByRegionIdFilterDto> {
    private readonly uiFeedbackService = inject(UiFeedbackService);
    private readonly fetchUseCase = inject(DepartmentsByRegionIdUseCase);

    readonly departmentsByRegionId$ = this.items$;

    private hasInitialized = false;
    private lastFetchTimestamp = 0;
    private readonly STALE_TIME = 2 * 60 * 1000;

    execute(filter: DepartmentsByRegionIdFilterDto | null, page: string = PAGINATION_CONST.DEFAULT_PAGE, forceRefresh: boolean = false): void {
        const hasData = this.itemsSubject.getValue().length > 0;
        if (!shouldFetch(forceRefresh, hasData, this.lastFetchTimestamp, this.STALE_TIME)) return;
        this.fetchWithFilterAndPage(filter, page, this.fetchUseCase.readAll.bind(this.fetchUseCase), this.uiFeedbackService);
        this.hasInitialized = true;
        this.lastFetchTimestamp = Date.now();
    }

    refresh(): void {
        const regionCode = this.filterSubject.getValue()?.regionCode ?? '';
        const firstPage = PAGINATION_CONST.DEFAULT_PAGE;
        this.fetchWithFilterAndPage({ regionCode }, firstPage, this.fetchUseCase.readAll.bind(this.fetchUseCase), this.uiFeedbackService);
        this.lastFetchTimestamp = Date.now();
    }

    changePage(pageNumber: number): void {
        const currentFilter = this.filterSubject.getValue();
        if (!currentFilter) return;
        this.fetchWithFilterAndPage(currentFilter, String(pageNumber), this.fetchUseCase.readAll.bind(this.fetchUseCase), this.uiFeedbackService);
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
