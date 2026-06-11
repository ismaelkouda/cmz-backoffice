import { inject, Injectable } from '@angular/core';
import { DepartmentsSelectUseCase } from '@pages/administrative-boundary/application/use-cases/departments/departments-select.use-case';
import { DepartmentsSelectEntity } from '@pages/administrative-boundary/domain/entities/departments/departments-select.entity';
import { ArrayBaseFacade } from '@shared/application/services/array-base-facade';

import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class DepartmentsSelectFacade extends ArrayBaseFacade<
    DepartmentsSelectEntity,
    void
> {
    private readonly uiFeedback = inject(UiFeedbackService);
    private readonly fetchUseCase = inject(DepartmentsSelectUseCase);

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
