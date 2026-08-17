import { inject, Injectable } from '@angular/core';
import { RequestsBus } from '@pages/reporting//application/queries-bus/requests/requests.bus';
import { RequestsEntity } from '@pages/reporting/domain/entities/requests/requests.entity';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class RequestsFacade extends ObjectBaseFacade<
    RequestsEntity,
    undefined
> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(RequestsBus);

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
