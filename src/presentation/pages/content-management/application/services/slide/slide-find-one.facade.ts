import { inject, Injectable } from '@angular/core';

import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';

import { SlideFindOneFilterDto } from '@presentation/pages/content-management/application/dto/slide/slide-find-one-filter.dto';
import { SlideFindOneQuery } from '@presentation/pages/content-management/application/queries/slide/slide-find-one.query';
import { SlideFindOneBus } from '@presentation/pages/content-management/application/queries-bus/slide/slide-find-one.bus';
import { SlideFindOneEntity } from '@presentation/pages/content-management/domain/entities/slide/slide-find-one.entity';

@Injectable({
    providedIn: 'root',
})
export class SlideFindOneFacade extends ObjectBaseFacade<
    SlideFindOneEntity,
    SlideFindOneFilterDto
> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(SlideFindOneBus);

    private readonly STALE_TIME = 2 * 60 * 1000;

    read(filter: SlideFindOneFilterDto, force = false): void {
        const command = new SlideFindOneQuery(filter.uniqId);
        const fetch$ = this.bus.dispatch(command);
        this.fetch(filter, fetch$, this.ui, this.STALE_TIME, force);
    }
}
