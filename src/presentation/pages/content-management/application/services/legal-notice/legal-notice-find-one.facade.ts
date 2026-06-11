import { inject, Injectable } from '@angular/core';
import { LegalNoticeFindOneFilterDto } from '@pages/content-management/application/dto/legal-notice/legal-notice-find-one-filter.dto';
import { LegalNoticeFindOneQuery } from '@pages/content-management/application/queries/legal-notice/legal-notice-find-one.query';
import { LegalNoticeFindOneBus } from '@pages/content-management/application/queries-bus/legal-notice/legal-notice-find-one.bus';
import { LegalNoticeFindOneEntity } from '@pages/content-management/domain/entities/legal-notice/legal-notice-find-one.entity';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class LegalNoticeFindOneFacade extends ObjectBaseFacade<
    LegalNoticeFindOneEntity,
    LegalNoticeFindOneFilterDto
> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(LegalNoticeFindOneBus);

    read(
        filter: LegalNoticeFindOneFilterDto,
        options: FetchOptions = {}
    ): void {
        const command = new LegalNoticeFindOneQuery(filter.uniqId);
        const fetch$ = this.bus.dispatch(command, options);
        this.fetch(filter, fetch$, this.ui);
    }
}
