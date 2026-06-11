import { inject, Injectable } from '@angular/core';
import { SlideFindOneFilterDto } from '@pages/content-management/application/dto/slide/slide-find-one-filter.dto';
import { SlideFindOneQuery } from '@pages/content-management/application/queries/slide/slide-find-one.query';
import { SlideFindOneBus } from '@pages/content-management/application/queries-bus/slide/slide-find-one.bus';
import { SlideFindOneEntity } from '@pages/content-management/domain/entities/slide/slide-find-one.entity';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class SlideFindOneFacade extends ObjectBaseFacade<
    SlideFindOneEntity,
    SlideFindOneFilterDto
> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(SlideFindOneBus);

    read(filter: SlideFindOneFilterDto, options: FetchOptions = {}): void {
        const command = new SlideFindOneQuery(filter.uniqId);
        const fetch$ = this.bus.dispatch(command, options);
        this.fetch(filter, fetch$, this.ui);
    }
}
