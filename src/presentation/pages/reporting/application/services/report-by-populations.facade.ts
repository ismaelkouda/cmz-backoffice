import { inject, Injectable } from '@angular/core';
import { ReportByPopulationsBus } from '@pages/reporting/application/queries-bus/report-by-populations/report-by-populations.bus';
import { ReportByPopulationsEntity } from '@pages/reporting/domain/entities/report-by-populations/report-by-populations.entity';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class ReportByPopulationsFacade extends ObjectBaseFacade<
    ReportByPopulationsEntity,
    undefined
> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(ReportByPopulationsBus);

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
