import { inject, Injectable } from '@angular/core';
import { JobsBus } from '@pages/reporting//application/queries-bus/jobs/jobs.bus';
import { JobsEntity } from '@pages/reporting/domain/entities/jobs/jobs.entity';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';

@Injectable({
    providedIn: 'root',
})
export class JobsFacade extends ObjectBaseFacade<JobsEntity, undefined> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(JobsBus);
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
