import { inject, Injectable } from '@angular/core';
import { shouldFetch } from '@shared/application/base/facade.utils';
import { ObjectBaseFacade } from '@shared/application/base/object-base-facade';
import { UiFeedbackService } from '@shared/application/ui/ui-feedback.service';
import { DetailsEntity } from '../domain/entities/details/details.entity';
import { FetchDetailsUseCase } from '../domain/use-cases/details.use-case';
import { DetailsFilter } from '../domain/value-objects/details-filter.vo';

@Injectable({
    providedIn: 'root',
})
export class DetailsFacade extends ObjectBaseFacade<DetailsEntity, DetailsFilter> {
    private readonly uiFeedbackService = inject(UiFeedbackService);
    private readonly fetchUseCase = inject(FetchDetailsUseCase);

    readonly details$ = this.items$;

    private hasInitialized = false;
    private lastFetchTimestamp = 0;
    private readonly STALE_TIME = 2 * 60 * 1000;

    fetchDetails(id: string, endPointType?: EndPointType): void {
        const filter = DetailsFilter.create(id);
        const hasData = this.itemsSubject.getValue() != null;
        if (!shouldFetch(false, hasData, this.lastFetchTimestamp, this.STALE_TIME)) return;

        this.fetchWithFilter(filter, this.fetchUseCase.execute.bind(this.fetchUseCase), this.uiFeedbackService, endPointType);
    }
}
