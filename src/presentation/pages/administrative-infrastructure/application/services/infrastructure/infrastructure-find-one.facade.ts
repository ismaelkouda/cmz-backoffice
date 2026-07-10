import { inject, Injectable } from '@angular/core';
import { InfrastructureFindOneFilterDto } from '@presentation/pages/administrative-infrastructure/application/dto/infrastructure/infrastructure-find-one-filter.dto';
import { InfrastructureFindOneQuery } from '@presentation/pages/administrative-infrastructure/application/queries/infrastructure/infrastructure-find-one.query';
import { InfrastructureFindOneBus } from '@presentation/pages/administrative-infrastructure/application/queries-bus/infrastructure/infrastructure-find-one.bus';
import { InfrastructureFindOneEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure/infrastructure-find-one.entity';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class InfrastructureFindOneFacade extends ObjectBaseFacade<
    InfrastructureFindOneEntity,
    InfrastructureFindOneFilterDto
> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(InfrastructureFindOneBus);

    read(
        filter: InfrastructureFindOneFilterDto,
        options: FetchOptions = {}
    ): void {
        const command = new InfrastructureFindOneQuery(filter.uniqId);
        const fetch$ = this.bus.dispatch(command, options);
        this.fetch(filter, fetch$, this.ui);
    }
}
