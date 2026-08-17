import { inject, Injectable } from '@angular/core';
import { NewsCategoriesSelectUseCase } from '@pages/content-management/application/use-cases/news/news-categories-select.use-case';
import { NewsCategoriesSelectEntity } from '@pages/content-management/domain/entities/news/news-categories-select.entity';
import { ArrayBaseFacade } from '@shared/application/services/array-base-facade';

import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class NewsCategoriesSelectFacade extends ArrayBaseFacade<
    NewsCategoriesSelectEntity,
    void
> {
    private readonly uiFeedback = inject(UiFeedbackService);
    private readonly fetchUseCase = inject(NewsCategoriesSelectUseCase);

    readonly municipalitiesByDepartmentId$ = this.items$;

    private hasInitialized = false;
    private lastFetchTimestamp = 0;

    readAll(options: FetchOptions = {}): void {
        this.fetchWithFilter(
            null,
            this.fetchUseCase.execute.bind(this.fetchUseCase, options),
            this.uiFeedback
        );

        this.hasInitialized = true;
        this.lastFetchTimestamp = Date.now();
    }

    refresh(): void {
        this.filterSubject.next(null);

        this.fetchWithFilter(
            null,
            this.fetchUseCase.execute.bind(this.fetchUseCase, {
                forceRefresh: true,
            }),
            this.uiFeedback
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
