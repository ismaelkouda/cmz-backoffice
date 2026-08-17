import { inject, Injectable } from '@angular/core';
import { PrivacyPolicyFindOneFilterDto } from '@pages/content-management/application/dto/privacy-policy/privacy-policy-find-one-filter.dto';
import { PrivacyPolicyFindOneQuery } from '@pages/content-management/application/queries/privacy-policy/privacy-policy-find-one.query';
import { PrivacyPolicyFindOneBus } from '@pages/content-management/application/queries-bus/privacy-policy/privacy-policy-find-one.bus';
import { PrivacyPolicyFindOneEntity } from '@pages/content-management/domain/entities/privacy-policy/privacy-policy-find-one.entity';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class PrivacyPolicyFindOneFacade extends ObjectBaseFacade<
    PrivacyPolicyFindOneEntity,
    PrivacyPolicyFindOneFilterDto
> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(PrivacyPolicyFindOneBus);

    read(
        filter: PrivacyPolicyFindOneFilterDto,
        options: FetchOptions = {}
    ): void {
        const command = new PrivacyPolicyFindOneQuery(filter.uniqId);
        const fetch$ = this.bus.dispatch(command, options);
        this.fetch(filter, fetch$, this.ui);
    }
}
