import { inject, Injectable } from '@angular/core';

import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';

import { MunicipalitiesFindOneFilterDto } from '@presentation/pages/administrative-boundary/application/dto/municipalities/municipalities-find-one-filter.dto';
import { MunicipalitiesFindOneQuery } from '@presentation/pages/administrative-boundary/application/queries/municipalities/municipalities-find-one.query';
import { MunicipalitiesFindOneBus } from '@presentation/pages/administrative-boundary/application/queries-bus/municipalities/municipalities-find-one.bus';
import { MunicipalitiesFindOneEntity } from '@presentation/pages/administrative-boundary/domain/entities/municipalities/municipalities-find-one.entity';

@Injectable({ providedIn: 'root' })
export class MunicipalitiesFindOneFacade extends ObjectBaseFacade<
    MunicipalitiesFindOneEntity,
    MunicipalitiesFindOneFilterDto
> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(MunicipalitiesFindOneBus);

    private readonly STALE_TIME = 2 * 60 * 1000;

    read(filter: MunicipalitiesFindOneFilterDto, force = false): void {
        const command = new MunicipalitiesFindOneQuery(filter.uniqId);
        const fetch$ = this.bus.dispatch(command);
        this.fetch(filter, fetch$, this.ui, this.STALE_TIME, force);
    }
}
