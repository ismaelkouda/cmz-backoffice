import { inject, Injectable } from '@angular/core';
import { ArrayBaseFacade } from '@shared/application/services/array-base-facade';

import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';

import { MunicipalitiesSelectEntity } from '../../../domain/entities/municipalities/municipalities-select.entity';
import { MunicipalitiesSelectUseCase } from '../../use-cases/municipalities/municipalities-select.use-case';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class MunicipalitiesSelectFacade extends ArrayBaseFacade<
    MunicipalitiesSelectEntity,
    void
> {
    private readonly uiFeedback = inject(UiFeedbackService);
    private readonly fetchUseCase = inject(MunicipalitiesSelectUseCase);

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
}
