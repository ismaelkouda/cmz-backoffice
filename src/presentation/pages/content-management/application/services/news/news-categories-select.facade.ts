import { inject, Injectable } from '@angular/core';

import { ArrayBaseFacade } from '@shared/application/services/array-base-facade';
import { shouldFetch } from '@shared/application/services/facade.utils';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';

import { NewsCategoriesSelectUseCase } from '@presentation/pages/content-management/application/use-cases/news/news-categories-select.use-case';
import { NewsCategoriesSelectEntity } from '@presentation/pages/content-management/domain/entities/news/news-categories-select.entity';

@Injectable({
    providedIn: 'root',
})
export class NewsCategoriesSelectFacade extends ArrayBaseFacade<
    NewsCategoriesSelectEntity,
    void
> {
    private readonly uiFeedbackService = inject(UiFeedbackService);
    private readonly fetchUseCase = inject(NewsCategoriesSelectUseCase);

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
