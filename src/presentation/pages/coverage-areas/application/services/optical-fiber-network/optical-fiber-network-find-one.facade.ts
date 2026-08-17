import { inject, Injectable } from '@angular/core';
import { OpticalFiberNetworkFindOneFilterDto } from '@pages/coverage-areas/application/dto/optical-fiber-network/optical-fiber-network-find-one-filter.dto';
import { OpticalFiberNetworkFindOneQuery } from '@pages/coverage-areas/application/queries/optical-fiber-network/optical-fiber-network-find-one.query';
import { OpticalFiberNetworkFindOneBus } from '@pages/coverage-areas/application/queries-bus/optical-fiber-network/optical-fiber-network-find-one.bus';
import { OpticalFiberNetworkFindOneEntity } from '@pages/coverage-areas/domain/entities/optical-fiber-network/optical-fiber-network-find-one.entity';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class OpticalFiberNetworkFindOneFacade extends ObjectBaseFacade<
    OpticalFiberNetworkFindOneEntity,
    OpticalFiberNetworkFindOneFilterDto
> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(OpticalFiberNetworkFindOneBus);

    read(
        filter: OpticalFiberNetworkFindOneFilterDto,
        options: FetchOptions = {}
    ): void {
        const command = new OpticalFiberNetworkFindOneQuery(filter.uniqId);
        const fetch$ = this.bus.dispatch(command, options);
        this.fetch(filter, fetch$, this.ui);
    }
}
