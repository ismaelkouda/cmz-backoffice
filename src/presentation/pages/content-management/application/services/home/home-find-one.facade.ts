import { inject, Injectable } from '@angular/core';
import { HomeFindOneFilterDto } from '@pages/content-management/application/dto/home/home-find-one-filter.dto';
import { HomeFindOneQuery } from '@pages/content-management/application/queries/home/home-find-one.query';
import { HomeFindOneBus } from '@pages/content-management/application/queries-bus/home/home-find-one.bus';
import { HomeFindOneEntity } from '@pages/content-management/domain/entities/home/home-find-one.entity';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class HomeFindOneFacade extends ObjectBaseFacade<
    HomeFindOneEntity,
    HomeFindOneFilterDto
> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(HomeFindOneBus);

    read(filter: HomeFindOneFilterDto, options: FetchOptions = {}): void {
        const command = new HomeFindOneQuery(filter.uniqId);
        const fetch$ = this.bus.dispatch(command, options);
        this.fetch(filter, fetch$, this.ui);
    }
}
