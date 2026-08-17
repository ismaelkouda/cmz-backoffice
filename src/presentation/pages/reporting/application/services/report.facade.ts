import { inject, Injectable } from '@angular/core';
import { ReportsBus } from '@pages/reporting//application/queries-bus/reports/reports.bus';
import { ReportsEntity } from '@pages/reporting/domain/entities/reports/reports.entity';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class ReportFacade extends ObjectBaseFacade<ReportsEntity, undefined> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(ReportsBus);

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
