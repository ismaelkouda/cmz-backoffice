import { inject, Injectable } from '@angular/core';
import { TermsUseFindOneFilterDto } from '@pages/content-management/application/dto/terms-use/terms-use-find-one-filter.dto';
import { TermsUseFindOneQuery } from '@pages/content-management/application/queries/terms-use/terms-use-find-one.query';
import { TermsUseFindOneBus } from '@pages/content-management/application/queries-bus/terms-use/terms-use-find-one.bus';
import { TermsUseFindOneEntity } from '@pages/content-management/domain/entities/terms-use/terms-use-find-one.entity';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class TermsUseFindOneFacade extends ObjectBaseFacade<
    TermsUseFindOneEntity,
    TermsUseFindOneFilterDto
> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(TermsUseFindOneBus);

    read(filter: TermsUseFindOneFilterDto, options: FetchOptions = {}): void {
        const command = new TermsUseFindOneQuery(filter.uniqId);
        const fetch$ = this.bus.dispatch(command, options);
        this.fetch(filter, fetch$, this.ui);
    }
}
