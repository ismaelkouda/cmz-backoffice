import { inject, Injectable } from '@angular/core';
import { BaseFacade } from '@shared/application/services/base-facade';

import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';

import { HistoryEntity } from '../../domain/entities/history.entity';
import { HistoryFilterBus } from '../bus/history-filter.bus';
import { HistoryFilterCommand } from '../commands/history-filter.command';
import { HistoryFilterDto } from '../dto/history-filter.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class HistoryFacade extends BaseFacade<HistoryEntity, HistoryFilterDto> {
    private readonly uiFeedback = inject(UiFeedbackService);
    private readonly filterBus = inject(HistoryFilterBus);

    private hasInitialized = false;
    private lastFetchTimestamp = 0;

    readAll(
        filter: HistoryFilterDto,
        page: string = PAGINATION_CONST.DEFAULT_PAGE,
        options: FetchOptions = {}
    ): void {
        const command = new HistoryFilterCommand(
            filter.typeModel,
            filter.module,
            filter?.search,
            filter?.startDate,
            filter?.endDate
        );
        const fetch$ = this.filterBus.dispatch(command, page, options);
        this.fetchWithFilterAndPage(filter, page, fetch$, this.uiFeedback);

        this.hasInitialized = true;
        this.lastFetchTimestamp = Date.now();
    }

    refresh(): void {
        this.pageSubject.next(PAGINATION_CONST.DEFAULT_PAGE);
        const filter = this.filterSubject.getValue();
        const page = this.pageSubject.getValue();
        const command = new HistoryFilterCommand(
            filter?.typeModel ?? '',
            filter?.module
        );
        const fetch$ = this.filterBus.dispatch(command, page, {
            forceRefresh: true,
        });
        this.fetchWithFilterAndPage(filter, page, fetch$, this.uiFeedback);
        this.lastFetchTimestamp = Date.now();
    }

    changePage(page: string): void {
        const filter = this.filterSubject.getValue();
        if (!filter) {
            return;
        }
        const command = new HistoryFilterCommand(
            filter.typeModel ?? '',
            filter?.module,
            filter?.search,
            filter?.startDate,
            filter?.endDate
        );
        const fetch$ = this.filterBus.dispatch(command, page);
        this.fetchWithFilterAndPage(filter, page, fetch$, this.uiFeedback);
        this.lastFetchTimestamp = Date.now();
    }
}
