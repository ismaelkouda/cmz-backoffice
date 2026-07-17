import { inject, Injectable } from '@angular/core';
import { ReportByChannelBus } from '@pages/reporting/application/queries-bus/report-by-channel/report-by-channel.bus';
import { ReportByChannelEntity } from '@pages/reporting/domain/entities/report-by-channel/report-by-channel.entity';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class ReportByChannelFacade extends ObjectBaseFacade<
    ReportByChannelEntity,
    undefined
> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(ReportByChannelBus);

    execute(options?: FetchOptions): void {
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
