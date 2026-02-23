import { inject, Injectable } from '@angular/core';

import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';

import { UsersFindOneFilterDto } from '@presentation/pages/settings-security/core/application/dto/users/users-find-one-filter.dto';
import { UsersFindOneQuery } from '@presentation/pages/settings-security/core/application/queries/users/users-find-one.query';
import { UsersFindOneBus } from '@presentation/pages/settings-security/core/application/queries-bus/users/users-find-one.bus';
import { UsersFindOneEntity } from '@presentation/pages/settings-security/core/domain/entities/users/users-find-one.entity';

@Injectable({
    providedIn: 'root',
})
export class UsersFindOneFacade extends ObjectBaseFacade<
    UsersFindOneEntity,
    UsersFindOneFilterDto
> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(UsersFindOneBus);

    private readonly STALE_TIME = 2 * 60 * 1000;

    read(filter: UsersFindOneFilterDto, force = false): void {
        const command = new UsersFindOneQuery(filter.uniqId);
        const fetch$ = this.bus.dispatch(command);
        this.fetch(filter, fetch$, this.ui, this.STALE_TIME, force);
    }
}
