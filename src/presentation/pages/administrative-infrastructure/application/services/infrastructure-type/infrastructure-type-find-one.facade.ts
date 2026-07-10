import { inject, Injectable } from '@angular/core';
import { InfrastructureTypeFindOneFilterDto } from '@presentation/pages/administrative-infrastructure/application/dto/infrastructure-type/infrastructure-type-find-one-filter.dto';
import { InfrastructureTypeFindOneQuery } from '@presentation/pages/administrative-infrastructure/application/queries/infrastructure-type/infrastructure-type-find-one.query';
import { InfrastructureTypeFindOneBus } from '@presentation/pages/administrative-infrastructure/application/queries-bus/infrastructure-type/infrastructure-type-find-one.bus';
import { InfrastructureTypeFindOneEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure-type/infrastructure-type-find-one.entity';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class InfrastructureTypeFindOneFacade extends ObjectBaseFacade<
    InfrastructureTypeFindOneEntity,
    InfrastructureTypeFindOneFilterDto
> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(InfrastructureTypeFindOneBus);

    read(
        filter: InfrastructureTypeFindOneFilterDto,
        options: FetchOptions = {}
    ): void {
        const command = new InfrastructureTypeFindOneQuery(filter.uniqId);
        const fetch$ = this.bus.dispatch(command, options);
        this.fetch(filter, fetch$, this.ui);
    }
}
