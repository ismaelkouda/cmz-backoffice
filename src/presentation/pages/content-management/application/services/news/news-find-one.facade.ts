import { inject, Injectable } from '@angular/core';

import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';

import { NewsFindOneFilterDto } from '@presentation/pages/content-management/application/dto/news/news-find-one-filter.dto';
import { NewsFindOneQuery } from '@presentation/pages/content-management/application/queries/news/news-find-one.query';
import { NewsFindOneBus } from '@presentation/pages/content-management/application/queries-bus/news/news-find-one.bus';
import { NewsFindOneEntity } from '@presentation/pages/content-management/domain/entities/news/news-find-one.entity';

@Injectable({
    providedIn: 'root',
})
export class NewsFindOneFacade extends ObjectBaseFacade<
    NewsFindOneEntity,
    NewsFindOneFilterDto
> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(NewsFindOneBus);

    private readonly STALE_TIME = 2 * 60 * 1000;

    read(filter: NewsFindOneFilterDto, force = false): void {
        const command = new NewsFindOneQuery(filter.uniqId);
        const fetch$ = this.bus.dispatch(command);
        this.fetch(filter, fetch$, this.ui, this.STALE_TIME, force);
    }
}
