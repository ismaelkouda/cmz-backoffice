import { inject, Injectable } from '@angular/core';

import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';

import { LegalNoticeFindOneFilterDto } from '@presentation/pages/content-management/application/dto/legal-notice/legal-notice-find-one-filter.dto';
import { LegalNoticeFindOneQuery } from '@presentation/pages/content-management/application/queries/legal-notice/legal-notice-find-one.query';
import { LegalNoticeFindOneBus } from '@presentation/pages/content-management/application/queries-bus/legal-notice/legal-notice-find-one.bus';
import { LegalNoticeFindOneEntity } from '@presentation/pages/content-management/domain/entities/legal-notice/legal-notice-find-one.entity';

@Injectable({
    providedIn: 'root',
})
export class LegalNoticeFindOneFacade extends ObjectBaseFacade<
    LegalNoticeFindOneEntity,
    LegalNoticeFindOneFilterDto
> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(LegalNoticeFindOneBus);

    private readonly STALE_TIME = 2 * 60 * 1000;

    read(filter: LegalNoticeFindOneFilterDto, force = false): void {
        const command = new LegalNoticeFindOneQuery(filter.uniqId);
        const fetch$ = this.bus.dispatch(command);
        this.fetch(filter, fetch$, this.ui, this.STALE_TIME, force);
    }
}
