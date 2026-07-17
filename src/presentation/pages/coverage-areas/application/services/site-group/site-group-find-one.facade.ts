import { inject, Injectable } from '@angular/core';
import { SiteGroupFindOneFilterDto } from '@pages/coverage-areas/application/dto/site-group/site-group-find-one-filter.dto';
import { SiteGroupFindOneQuery } from '@pages/coverage-areas/application/queries/site-group/site-group-find-one.query';
import { SiteGroupFindOneBus } from '@pages/coverage-areas/application/queries-bus/site-group/site-group-find-one.bus';
import { SiteGroupFindOneEntity } from '@pages/coverage-areas/domain/entities/site-group/site-group-find-one.entity';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class SiteGroupFindOneFacade extends ObjectBaseFacade<
    SiteGroupFindOneEntity,
    SiteGroupFindOneFilterDto
> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(SiteGroupFindOneBus);

    read(
        filter: SiteGroupFindOneFilterDto,
        options: FetchOptions = {}
    ): void {
        const command = new SiteGroupFindOneQuery(filter.uniqId);
        const fetch$ = this.bus.dispatch(command, options);
        this.fetch(filter, fetch$, this.ui);
    }
}
