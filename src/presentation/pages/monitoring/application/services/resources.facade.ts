import { inject, Injectable } from '@angular/core';
import { ResourcesBus } from '@pages/monitoring/application/queries-bus/resources/resources.bus';
import { ResourcesEntity } from '@pages/monitoring/domain/entities/resources/resources.entity';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class ResourcesFacade extends ObjectBaseFacade<
    ResourcesEntity,
    undefined
> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(ResourcesBus);

    execute(options: FetchOptions = {}): void {
        const fetch$ = this.bus.dispatch(options);
        this.fetch(undefined, fetch$, this.ui);
    }

    refresh(): void {
        const fetch$ = this.bus.dispatch({
            forceRefresh: true,
        });
        this.fetch(undefined, fetch$, this.ui);
    }
}
