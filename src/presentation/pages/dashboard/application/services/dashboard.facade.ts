import { inject, Injectable } from '@angular/core';

import { shouldFetch } from '@shared/application/services/facade.utils';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';

import { DashboardFilterDto } from '@presentation/pages/dashboard/application/dto/dashboard-filter.dto';
import { DashboardQuery } from '@presentation/pages/dashboard/application/queries/dashboard.query';
import { DashboardBus } from '@presentation/pages/dashboard/application/queries-bus/dashboard.bus';
import { DashboardEntity } from '@presentation/pages/dashboard/domain/entities/dashboard.entity';

@Injectable({
    providedIn: 'root',
})
export class DashboardFacade extends ObjectBaseFacade<
    DashboardEntity,
    DashboardFilterDto
> {
    private readonly uiFeedbackService = inject(UiFeedbackService);
    private readonly bus = inject(DashboardBus);

    private hasInitialized = false;
    private lastFetchTimestamp = 0;
    private readonly STALE_TIME = 2 * 60 * 1000;

    read(filter: DashboardFilterDto, forceRefresh = false): void {
        const hasData = this.itemsSubject.getValue() !== null;
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
        console.log('🚀 ~ DashboardFacade ~ read ~ filter:', filter);
        const command = new DashboardQuery(filter.period);
        const fetch$ = this.bus.dispatch(command);
        this.fetchWithFilter(filter, fetch$, this.uiFeedbackService);

        this.hasInitialized = true;
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
