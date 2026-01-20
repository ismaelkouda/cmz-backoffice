import { inject, Injectable } from '@angular/core';
import { shouldFetch } from '@shared/application/base/facade.utils';
import { ObjectBaseFacade } from '@shared/application/base/object-base-facade';
import { UiFeedbackService } from '@shared/application/ui/ui-feedback.service';
import { MunicipalitiesFindoneEntity } from '../../../domain/entities/municipalities/municipalities-findone.entity';
import { MunicipalitiesFindoneFilterDto } from '../../dtos/municipalities/municipalities-findone-filter.dto';
import { MunicipalitiesFindoneUseCase } from '../../use-cases/municipalities/municipalities-findone.use-case';

@Injectable({
    providedIn: 'root'
})
export class MunicipalitiesFindoneFacade extends ObjectBaseFacade<MunicipalitiesFindoneEntity, MunicipalitiesFindoneFilterDto> {
    private readonly uiFeedbackService = inject(UiFeedbackService);
    private readonly useCase = inject(MunicipalitiesFindoneUseCase);

    readonly item$ = this.items$;

    private hasInitialized = false;
    private lastFetchTimestamp = 0;
    private readonly STALE_TIME = 2 * 60 * 1000;

    read(filter: MunicipalitiesFindoneFilterDto, forceRefresh: boolean = false): void {
        console.log('MunicipalitiesFindoneFilterDto', filter);
        const hasData = this.itemsSubject.getValue() != null;
        if (!shouldFetch(forceRefresh, hasData, this.lastFetchTimestamp, this.STALE_TIME)) return;
        this.fetchWithFilter(filter, this.useCase.read.bind(this.useCase), this.uiFeedbackService);
        console.log('MunicipalitiesFindoneFacade', this.items$);
        this.hasInitialized = true;
        this.lastFetchTimestamp = Date.now();
    }
}
