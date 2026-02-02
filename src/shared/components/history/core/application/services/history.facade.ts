import { inject, Injectable } from '@angular/core';

import { BaseFacade } from '@shared/application/base/base-facade';
import { shouldFetch } from '@shared/application/base/facade.utils';
import { UiFeedbackService } from '@shared/application/ui/ui-feedback.service';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';

import { HistoryEntity } from '../../domain/entities/history.entity';
import { HistoryFilterDto } from '../dtos/history-filter.dto';
import { HistoryUseCase } from '../use-cases/history.use-case';

@Injectable({
    providedIn: 'root',
})
export class HistoryFacade extends BaseFacade<HistoryEntity, HistoryFilterDto> {
    private readonly useCase = inject(HistoryUseCase);
    private readonly uiFeedbackService = inject(UiFeedbackService);

    private hasInitialized = false;
    private lastFetchTimestamp = 0;
    private readonly STALE_TIME = 2 * 60 * 1000;

    readAll(
        filter: HistoryFilterDto | null = {},
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

        this.fetchWithFilterAndPage(
            filter,
            page,
            this.useCase.readAll.bind(this.useCase),
            this.uiFeedbackService
        );
        this.hasInitialized = true;
        this.lastFetchTimestamp = Date.now();
    }

    refresh(): void {
        this.filterSubject.next(null);
        const firstPage = PAGINATION_CONST.DEFAULT_PAGE;
        this.pageSubject.next(firstPage);
        this.fetchWithFilterAndPage(
            null,
            firstPage,
            this.useCase.readAll.bind(this.useCase),
            this.uiFeedbackService
        );
        this.lastFetchTimestamp = Date.now();
    }

    changePage(pageNumber: number): void {
        const currentFilter = this.filterSubject.getValue();
        if (!currentFilter) {
            this.fetchWithFilterAndPage(
                currentFilter || {},
                String(pageNumber),
                this.useCase.readAll.bind(this.useCase),
                this.uiFeedbackService
            );
        } else {
            this.fetchWithFilterAndPage(
                currentFilter,
                String(pageNumber),
                this.useCase.readAll.bind(this.useCase),
                this.uiFeedbackService
            );
        }

        this.lastFetchTimestamp = Date.now();
    }
}
