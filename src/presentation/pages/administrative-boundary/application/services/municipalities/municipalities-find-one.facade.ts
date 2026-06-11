import { inject, Injectable } from '@angular/core';
import { MunicipalitiesFindOneFilterDto } from '@pages/administrative-boundary/application/dto/municipalities/municipalities-find-one-filter.dto';
import { MunicipalitiesFindOneQuery } from '@pages/administrative-boundary/application/queries/municipalities/municipalities-find-one.query';
import { MunicipalitiesFindOneBus } from '@pages/administrative-boundary/application/queries-bus/municipalities/municipalities-find-one.bus';
import { MunicipalitiesFindOneEntity } from '@pages/administrative-boundary/domain/entities/municipalities/municipalities-find-one.entity';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({ providedIn: 'root' })
export class MunicipalitiesFindOneFacade extends ObjectBaseFacade<
    MunicipalitiesFindOneEntity,
    MunicipalitiesFindOneFilterDto
> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(MunicipalitiesFindOneBus);

    read(
        filter: MunicipalitiesFindOneFilterDto,
        options: FetchOptions = {}
    ): void {
        const command = new MunicipalitiesFindOneQuery(filter.uniqId);
        const fetch$ = this.bus.dispatch(command, options);
        this.fetch(filter, fetch$, this.ui);
    }
}
