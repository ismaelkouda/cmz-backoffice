import { inject, Injectable } from '@angular/core';
import { RegionsUseCase } from '@presentation/pages/administrative-boundary/core/application/use-cases/regions/regions.use-case';
import { RegionsEntity } from '@presentation/pages/administrative-boundary/core/domain/entities/regions/regions.entity';
import { BaseFacade } from '@shared/application/base/base-facade';
import { handleObservableWithFeedback, shouldFetch } from '@shared/application/base/facade.utils';
import { UiFeedbackService } from '@shared/application/ui/ui-feedback.service';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { Observable } from 'rxjs';
import { RegionsCreateDto } from '../../dtos/regions/regions-create.dto';
import { RegionsFilterDto } from '../../dtos/regions/regions-filter.dto';
import { RegionsUpdateDto } from '../../dtos/regions/regions-update.dto';

@Injectable({
    providedIn: 'root'
})
export class RegionsFacade extends BaseFacade<RegionsEntity, RegionsFilterDto> {
    private readonly uiFeedbackService = inject(UiFeedbackService);
    private readonly useCase = inject(RegionsUseCase);

    readonly regions$ = this.items$;

    private hasInitialized = false;
    private lastFetchTimestamp = 0;
    private readonly STALE_TIME = 2 * 60 * 1000;

    private handleActionWithRefresh<T>(observable: Observable<T>, successKey: string): Observable<T> {
        return handleObservableWithFeedback(observable, this.uiFeedbackService, successKey, () => this.refresh());
    }

    readAll(filter: RegionsFilterDto | null = {}, page: string = PAGINATION_CONST.DEFAULT_PAGE, forceRefresh: boolean = false): void {
        const hasData = this.itemsSubject.getValue().length > 0;
        if (!shouldFetch(forceRefresh, hasData, this.lastFetchTimestamp, this.STALE_TIME)) return;

        this.fetchWithFilterAndPage(filter, page, this.useCase.readAll.bind(this.useCase), this.uiFeedbackService);

        this.hasInitialized = true;
        this.lastFetchTimestamp = Date.now();
    }

    refresh(): void {
        this.filterSubject.next(null);
        const firstPage = PAGINATION_CONST.DEFAULT_PAGE;
        this.pageSubject.next(firstPage);
        this.fetchWithFilterAndPage(null, firstPage, this.useCase.readAll.bind(this.useCase), this.uiFeedbackService);
        this.lastFetchTimestamp = Date.now();
    }

    changePage(pageNumber: number): void {
        const currentFilter = this.filterSubject.getValue();
        if (!currentFilter) return;
        this.fetchWithFilterAndPage(currentFilter, String(pageNumber), this.useCase.readAll.bind(this.useCase), this.uiFeedbackService);
        this.lastFetchTimestamp = Date.now();
    }

    refreshWithLastFilterAndPage(): void {
        const currentFilter = this.filterSubject.getValue();
        const currentPage = this.pageSubject.getValue();
        this.fetchWithFilterAndPage(currentFilter, currentPage, this.useCase.readAll.bind(this.useCase), this.uiFeedbackService);
        this.lastFetchTimestamp = Date.now();
    }

    create(payloadDto: RegionsCreateDto) {
        return this.handleActionWithRefresh(this.useCase.create(payloadDto), 'COMMON.SUCCESS.CREATE');
    }

    update(payloadDto: RegionsUpdateDto) {
        return this.handleActionWithRefresh(this.useCase.update(payloadDto), 'COMMON.SUCCESS.UPDATE');
    }

    delete(code: string) {
        return this.handleActionWithRefresh(this.useCase.delete(code), 'COMMON.SUCCESS.DELETE');
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
