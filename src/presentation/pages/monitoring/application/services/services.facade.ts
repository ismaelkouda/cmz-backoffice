import { inject, Injectable } from '@angular/core';
import { ServicesBus } from '@pages/monitoring/application/queries-bus/services/services.bus';
import { ServicesEntity } from '@pages/monitoring/domain/entities/services/services.entity';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class ServicesFacade extends ObjectBaseFacade<
    ServicesEntity,
    undefined
> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(ServicesBus);

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
