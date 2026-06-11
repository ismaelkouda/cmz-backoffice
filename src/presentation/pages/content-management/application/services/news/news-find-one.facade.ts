import { inject, Injectable } from '@angular/core';
import { NewsFindOneFilterDto } from '@pages/content-management/application/dto/news/news-find-one-filter.dto';
import { NewsFindOneQuery } from '@pages/content-management/application/queries/news/news-find-one.query';
import { NewsFindOneBus } from '@pages/content-management/application/queries-bus/news/news-find-one.bus';
import { NewsFindOneEntity } from '@pages/content-management/domain/entities/news/news-find-one.entity';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class NewsFindOneFacade extends ObjectBaseFacade<
    NewsFindOneEntity,
    NewsFindOneFilterDto
> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(NewsFindOneBus);

    read(filter: NewsFindOneFilterDto, options: FetchOptions = {}): void {
        const command = new NewsFindOneQuery(filter.uniqId);
        const fetch$ = this.bus.dispatch(command, options);
        this.fetch(filter, fetch$, this.ui);
    }
}
