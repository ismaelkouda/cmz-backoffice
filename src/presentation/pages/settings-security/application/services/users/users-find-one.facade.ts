import { inject, Injectable } from '@angular/core';
import { UsersFindOneFilterDto } from '@pages/settings-security/application/dto/users/users-find-one-filter.dto';
import { UsersFindOneQuery } from '@pages/settings-security/application/queries/users/users-find-one.query';
import { UsersFindOneBus } from '@pages/settings-security/application/queries-bus/users/users-find-one.bus';
import { UsersFindOneEntity } from '@pages/settings-security/domain/entities/users/users-find-one.entity';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class UsersFindOneFacade extends ObjectBaseFacade<
    UsersFindOneEntity,
    UsersFindOneFilterDto
> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(UsersFindOneBus);

    read(filter: UsersFindOneFilterDto, options: FetchOptions = {}): void {
        const command = new UsersFindOneQuery(filter.uniqId);
        const fetch$ = this.bus.dispatch(command, options);
        this.fetch(filter, fetch$, this.ui);
    }
}
