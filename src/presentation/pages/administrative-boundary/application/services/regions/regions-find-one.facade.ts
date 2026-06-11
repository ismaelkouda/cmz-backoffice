import { inject, Injectable } from '@angular/core';
import { RegionsFindOneFilterDto } from '@pages/administrative-boundary/application/dto/regions/regions-find-one-filter.dto';
import { RegionsFindOneQuery } from '@pages/administrative-boundary/application/queries/regions/regions-find-one.query';
import { RegionsFindOneBus } from '@pages/administrative-boundary/application/queries-bus/regions/regions-find-one.bus';
import { RegionsFindOneEntity } from '@pages/administrative-boundary/domain/entities/regions/regions-find-one.entity';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({ providedIn: 'root' })
export class RegionsFindOneFacade extends ObjectBaseFacade<
    RegionsFindOneEntity,
    RegionsFindOneFilterDto
> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(RegionsFindOneBus);

    read(filter: RegionsFindOneFilterDto, options: FetchOptions = {}): void {
        const command = new RegionsFindOneQuery(filter.uniqId);
        const fetch$ = this.bus.dispatch(command, options);
        this.fetch(filter, fetch$, this.ui);
    }
}
