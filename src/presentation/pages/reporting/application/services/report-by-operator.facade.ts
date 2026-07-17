import { inject, Injectable } from '@angular/core';
import { ReportByOperatorBus } from '@pages/reporting/application/queries-bus/report-by-operator/report-by-operator.bus';
import { ReportByOperatorEntity } from '@pages/reporting/domain/entities/report-by-operator/report-by-operator.entity';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class ReportByOperatorFacade extends ObjectBaseFacade<
    ReportByOperatorEntity,
    undefined
> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(ReportByOperatorBus);

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
