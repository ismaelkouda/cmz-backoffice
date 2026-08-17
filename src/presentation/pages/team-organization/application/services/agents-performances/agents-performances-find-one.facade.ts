import { inject, Injectable } from '@angular/core';
import { AgentsPerformancesFindOneFilterDto } from '@pages/team-organization/application/dto/agents-performances/agents-performances-find-one-filter.dto';
import { AgentsPerformancesFindOneQuery } from '@pages/team-organization/application/queries/agents-performances/agents-performances-find-one.query';
import { AgentsPerformancesFindOneBus } from '@pages/team-organization/application/queries-bus/agents-performances/agents-performances-find-one.bus';
import { AgentsPerformancesFindOneEntity } from '@pages/team-organization/domain/entities/agents-performances/agents-performances-find-one.entity';
import { BaseFacade } from '@shared/application/services/base-facade';

import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class AgentsPerformancesFindOneFacade extends BaseFacade<
    AgentsPerformancesFindOneEntity,
    AgentsPerformancesFindOneFilterDto
> {
    private readonly uiFeedback = inject(UiFeedbackService);
    private readonly filterBus = inject(AgentsPerformancesFindOneBus);

    private hasInitialized = false;
    private lastFetchTimestamp = 0;

    read(
        filter: AgentsPerformancesFindOneFilterDto,
        page: string = PAGINATION_CONST.DEFAULT_PAGE,
        options: FetchOptions = {}
    ): void {
        const command = new AgentsPerformancesFindOneQuery(
            filter?.uniqId,
            filter?.search,
            filter?.reportType,
            filter?.operators,
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
        const command = new AgentsPerformancesFindOneQuery(
            filter?.uniqId ?? '',
            filter?.search,
            filter?.reportType,
            filter?.operators,
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
        const command = new AgentsPerformancesFindOneQuery(
            filter?.uniqId,
            filter?.search,
            filter?.reportType,
            filter?.operators,
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
        const command = new AgentsPerformancesFindOneQuery(
            filter?.uniqId ?? '',
            filter?.search,
            filter?.reportType,
            filter?.operators,
            filter?.startDate,
            filter?.endDate
        );
        const fetch$ = this.filterBus.dispatch(command, page);
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
