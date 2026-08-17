import { inject, Injectable } from '@angular/core';
import { AllFilterDto } from '@pages/processing/application/dto/all/all-filter.dto';
import { AllQuery } from '@pages/processing/application/queries/all/all.query';
import { AllBus } from '@pages/processing/application/queries-bus/all/all.bus';
import { AllEntity } from '@pages/processing/domain/entities/all/all.entity';
import { BaseFacade } from '@shared/application/services/base-facade';

import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';

@Injectable({ providedIn: 'root' })
export class AllFacade extends BaseFacade<AllEntity, AllFilterDto> {
    private readonly uiFeedback = inject(UiFeedbackService);
    private readonly filterBus = inject(AllBus);

    private hasInitialized = false;
    private lastFetchTimestamp = 0;

    read(
        filter: AllFilterDto = {},
        page: string = PAGINATION_CONST.DEFAULT_PAGE,
        options: FetchOptions = {}
    ): void {
        const command = new AllQuery(
            filter?.initiatorPhoneNumber,
            filter?.uniqId,
            filter?.reportType,
            filter?.operators,
            filter?.source,
            filter?.state,
            filter?.startDate,
            filter?.endDate
        );
        const fetch$ = this.filterBus.dispatch(command, page, options);
        this.fetchWithFilterAndPage(filter, page, fetch$, this.uiFeedback);

        this.hasInitialized = true;
        this.lastFetchTimestamp = Date.now();
    }

    refresh(): void {
        this.filterSubject.next(null);
        this.pageSubject.next(PAGINATION_CONST.DEFAULT_PAGE);
        const filter = this.filterSubject.getValue();
        const page = this.pageSubject.getValue();
        const command = new AllQuery(
            filter?.initiatorPhoneNumber,
            filter?.uniqId,
            filter?.reportType,
            filter?.operators,
            filter?.source,
            filter?.state,
            filter?.startDate,
            filter?.endDate
        );
        const fetch$ = this.filterBus.dispatch(command, page, {
            forceRefresh: true,
        });
        this.fetchWithFilterAndPage(null, page, fetch$, this.uiFeedback);
        this.lastFetchTimestamp = Date.now();
    }

    changePage(page: string): void {
        const filter = this.filterSubject.getValue();
        if (!filter) {
            return;
        }
        const command = new AllQuery(
            filter?.initiatorPhoneNumber,
            filter?.uniqId,
            filter?.reportType,
            filter?.operators,
            filter?.source,
            filter?.state,
            filter?.startDate,
            filter?.endDate
        );
        const fetch$ = this.filterBus.dispatch(command, page);
        this.fetchWithFilterAndPage(filter, page, fetch$, this.uiFeedback);
        this.lastFetchTimestamp = Date.now();
    }

    refreshWithLastFilterAndPage(): void {
        const filter = this.filterSubject.getValue();
        const page = this.pageSubject.getValue();
        const command = new AllQuery(
            filter?.initiatorPhoneNumber,
            filter?.uniqId,
            filter?.reportType,
            filter?.operators,
            filter?.source,
            filter?.state,
            filter?.startDate,
            filter?.endDate
        );
        const fetch$ = this.filterBus.dispatch(command, page, {
            forceRefresh: true,
        });
        this.fetchWithFilterAndPage(filter, page, fetch$, this.uiFeedback);
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
