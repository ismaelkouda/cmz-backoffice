import { inject, Injectable } from '@angular/core';
import { shouldFetch } from '@shared/application/base/facade.utils';
import { ObjectBaseFacade } from '@shared/application/base/object-base-facade';
import { UiFeedbackService } from '@shared/application/ui/ui-feedback.service';
import { RegionsFindoneEntity } from '../../../domain/entities/regions/regions-findone.entity';
import { RegionsFindoneFilterDto } from '../../dtos/regions/regions-findone-filter.dto';
import { RegionsFindoneUseCase } from '../../use-cases/regions/regions-findone.use-case';

@Injectable({
    providedIn: 'root'
})
export class RegionsFindoneFacade extends ObjectBaseFacade<RegionsFindoneEntity, RegionsFindoneFilterDto> {
    private readonly uiFeedbackService = inject(UiFeedbackService);
    private readonly useCase = inject(RegionsFindoneUseCase);

    readonly item$ = this.items$;

    private hasInitialized = false;
    private lastFetchTimestamp = 0;
    private readonly STALE_TIME = 2 * 60 * 1000;

    read(filter: RegionsFindoneFilterDto, forceRefresh: boolean = false): void {
        const hasData = this.itemsSubject.getValue() != null;
        if (!shouldFetch(forceRefresh, hasData, this.lastFetchTimestamp, this.STALE_TIME)) return;
        this.fetchWithFilter(filter, this.useCase.read.bind(this.useCase), this.uiFeedbackService);
        this.hasInitialized = true;
        this.lastFetchTimestamp = Date.now();
    }
}
