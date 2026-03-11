import { inject, Injectable } from '@angular/core';
import { RegionsSelectUseCase } from '@pages/administrative-boundary/application/use-cases/regions/regions-select.use-case';
import { RegionsSelectEntity } from '@pages/administrative-boundary/domain/entities/regions/regions-select.entity';
import { ArrayBaseFacade } from '@shared/application/services/array-base-facade';
import { shouldFetch } from '@shared/application/services/facade.utils';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';

@Injectable({
    providedIn: 'root',
})
export class RegionsSelectFacade extends ArrayBaseFacade<
    RegionsSelectEntity,
    void
> {
    private readonly uiFeedbackService = inject(UiFeedbackService);
    private readonly fetchUseCase = inject(RegionsSelectUseCase);

    readonly municipalitiesByDepartmentId$ = this.items$;

    private hasInitialized = false;
    private lastFetchTimestamp = 0;
    private readonly STALE_TIME = 2 * 60 * 1000;

    readAll(forceRefresh = false): void {
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

        this.fetchWithFilter(
            null,
            this.fetchUseCase.execute.bind(this.fetchUseCase),
            this.uiFeedbackService
        );

        this.hasInitialized = true;
        this.lastFetchTimestamp = Date.now();
    }

    refresh(): void {
        this.filterSubject.next(null);

        this.fetchWithFilter(
            null,
            this.fetchUseCase.execute.bind(this.fetchUseCase),
            this.uiFeedbackService
        );

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
