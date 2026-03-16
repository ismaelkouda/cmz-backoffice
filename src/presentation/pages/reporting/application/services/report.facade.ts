import { inject, Injectable } from '@angular/core';
import { ReportsBus } from '@pages/reporting//application/queries-bus/reports/reports.bus';
import { ReportsEntity } from '@pages/reporting/domain/entities/reports/reports.entity';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';

@Injectable({
    providedIn: 'root',
})
export class ReportFacade extends ObjectBaseFacade<ReportsEntity, undefined> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(ReportsBus);
    private readonly STALE_TIME = 2 * 60 * 1000;

    execute(force = false): void {
        const fetch$ = this.bus.dispatch();
        this.fetch(undefined, fetch$, this.ui, this.STALE_TIME, force);
    }

    refresh(): void {
        const fetch$ = this.bus.dispatch();
        this.fetch(undefined, fetch$, this.ui, this.STALE_TIME, true);
    }
}
