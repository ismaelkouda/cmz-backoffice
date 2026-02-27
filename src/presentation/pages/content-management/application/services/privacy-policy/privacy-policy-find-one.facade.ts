import { inject, Injectable } from '@angular/core';

import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';

import { PrivacyPolicyFindOneFilterDto } from '@presentation/pages/content-management/application/dto/privacy-policy/privacy-policy-find-one-filter.dto';
import { PrivacyPolicyFindOneQuery } from '@presentation/pages/content-management/application/queries/privacy-policy/privacy-policy-find-one.query';
import { PrivacyPolicyFindOneBus } from '@presentation/pages/content-management/application/queries-bus/privacy-policy/privacy-policy-find-one.bus';
import { PrivacyPolicyFindOneEntity } from '@presentation/pages/content-management/domain/entities/privacy-policy/privacy-policy-find-one.entity';

@Injectable({
    providedIn: 'root',
})
export class PrivacyPolicyFindOneFacade extends ObjectBaseFacade<
    PrivacyPolicyFindOneEntity,
    PrivacyPolicyFindOneFilterDto
> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(PrivacyPolicyFindOneBus);

    private readonly STALE_TIME = 2 * 60 * 1000;

    read(filter: PrivacyPolicyFindOneFilterDto, force = false): void {
        const command = new PrivacyPolicyFindOneQuery(filter.uniqId);
        const fetch$ = this.bus.dispatch(command);
        this.fetch(filter, fetch$, this.ui, this.STALE_TIME, force);
    }
}
