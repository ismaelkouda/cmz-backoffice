import { RadioRelayLinksFindOneEntity } from '@pages/coverage-areas/domain/entities/radio-relay-links/radio-relay-links-find-one.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { inject } from '@angular/core';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { RadioRelayLinksFindOneBus } from '@pages/coverage-areas/application/queries-bus/radio-relay-links/radio-relay-links-find-one.bus';
import { RadioRelayLinksFindOneQuery } from '@pages/coverage-areas/application/queries/radio-relay-links/radio-relay-links-find-one.query';
import { RadioRelayLinksFindOneFilterDto } from '@pages/coverage-areas/application/dto/radio-relay-links/radio-relay-links-find-one-filter.dto';

export class RadioRelayLinksFindOneFacade extends ObjectBaseFacade<
    RadioRelayLinksFindOneEntity,
    RadioRelayLinksFindOneFilterDto
> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(RadioRelayLinksFindOneBus);

    read(
        filter: RadioRelayLinksFindOneFilterDto,
        options: FetchOptions = {}
    ): void {
        const command = new RadioRelayLinksFindOneQuery(filter.uniqId);
        const fetch$ = this.bus.dispatch(command, options);
        this.fetch(filter, fetch$, this.ui);
    }
}
