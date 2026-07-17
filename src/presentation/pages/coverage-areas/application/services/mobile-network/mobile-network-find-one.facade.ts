import { inject, Injectable } from '@angular/core';
import { MobileNetworkFindOneFilterDto } from '@pages/coverage-areas/application/dto/mobile-network/mobile-network-find-one-filter.dto';
import { MobileNetworkFindOneQuery } from '@pages/coverage-areas/application/queries/mobile-network/mobile-network-find-one.query';
import { MobileNetworkFindOneBus } from '@pages/coverage-areas/application/queries-bus/mobile-network/mobile-network-find-one.bus';
import { MobileNetworkFindOneEntity } from '@pages/coverage-areas/domain/entities/mobile-network/mobile-network-find-one.entity';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class MobileNetworkFindOneFacade extends ObjectBaseFacade<
    MobileNetworkFindOneEntity,
    MobileNetworkFindOneFilterDto
> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(MobileNetworkFindOneBus);

    read(
        filter: MobileNetworkFindOneFilterDto,
        options: FetchOptions = {}
    ): void {
        const command = new MobileNetworkFindOneQuery(filter.uniqId);
        const fetch$ = this.bus.dispatch(command, options);
        this.fetch(filter, fetch$, this.ui);
    }
}
