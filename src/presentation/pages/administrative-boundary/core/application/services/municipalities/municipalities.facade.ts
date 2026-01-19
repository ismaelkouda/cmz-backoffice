import { inject, Injectable } from '@angular/core';
import { BaseFacade } from '@shared/application/base/base-facade';
import { handleObservableWithFeedback, shouldFetch } from '@shared/application/base/facade.utils';
import { UiFeedbackService } from '@shared/application/ui/ui-feedback.service';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { Observable } from 'rxjs';
import { MunicipalitiesEntity } from '../../../domain/entities/municipalities/municipalities.entity';
import { MunicipalitiesCreateDto } from '../../dtos/municipalities/municipalities-create.dto';
import { MunicipalitiesFilterDto } from '../../dtos/municipalities/municipalities-filter.dto';
import { MunicipalitiesUpdateDto } from '../../dtos/municipalities/municipalities-update.dto';
import { MunicipalitiesUseCase } from '../../use-cases/municipalities/municipalities.use-case';

@Injectable({
    providedIn: 'root'
})
export class MunicipalitiesFacade extends BaseFacade<MunicipalitiesEntity, MunicipalitiesFilterDto> {
    private readonly uiFeedbackService = inject(UiFeedbackService);
    private readonly useCase = inject(MunicipalitiesUseCase);

    readonly municipalities$ = this.items$;

    private hasInitialized = false;
    private lastFetchTimestamp = 0;
    private readonly STALE_TIME = 2 * 60 * 1000;

    private handleActionWithRefresh<T>(observable: Observable<T>, successKey: string): Observable<T> {
        return handleObservableWithFeedback(observable, this.uiFeedbackService, successKey, () => this.refresh());
    }

    readAll(filter: MunicipalitiesFilterDto | null = {}, page: string = PAGINATION_CONST.DEFAULT_PAGE, forceRefresh: boolean = false): void {
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

    create(payload: MunicipalitiesCreateDto) {
        return this.handleActionWithRefresh(this.useCase.create(payload), 'COMMON.SUCCESS.CREATE');
    }

    update(payload: MunicipalitiesUpdateDto) {
        return this.handleActionWithRefresh(this.useCase.update(payload), 'COMMON.SUCCESS.UPDATE');
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
