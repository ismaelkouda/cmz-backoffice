import { inject, Injectable } from '@angular/core';

import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';

import { RegionsFindOneFilterDto } from '@presentation/pages/administrative-boundary/application/dto/regions/regions-find-one-filter.dto';
import { RegionsFindOneQuery } from '@presentation/pages/administrative-boundary/application/queries/regions/regions-find-one.query';
import { RegionsFindOneBus } from '@presentation/pages/administrative-boundary/application/queries-bus/regions/regions-find-one.bus';
import { RegionsFindOneEntity } from '@presentation/pages/administrative-boundary/domain/entities/regions/regions-find-one.entity';

@Injectable({ providedIn: 'root' })
export class RegionsFindOneFacade extends ObjectBaseFacade<
    RegionsFindOneEntity,
    RegionsFindOneFilterDto
> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(RegionsFindOneBus);

    private readonly STALE_TIME = 2 * 60 * 1000;

    read(filter: RegionsFindOneFilterDto, force = false): void {
        const command = new RegionsFindOneQuery(filter.uniqId);
        const fetch$ = this.bus.dispatch(command);
        this.fetch(filter, fetch$, this.ui, this.STALE_TIME, force);
    }
}
