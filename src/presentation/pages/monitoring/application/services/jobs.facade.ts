import { inject, Injectable } from '@angular/core';
import { JobsBus } from '@presentation/pages/monitoring/application/queries-bus/jobs/jobs.bus';
import { JobsEntity } from '@presentation/pages/monitoring/domain/entities/jobs/jobs.entity';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class JobsFacade extends ObjectBaseFacade<JobsEntity, undefined> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(JobsBus);

    execute(options?: FetchOptions): void {
        const fetch$ = this.bus.dispatch(options);
        this.fetch(undefined, fetch$, this.ui);
    }

    refresh(): void {
        const fetch$ = this.bus.dispatch();
        this.fetch(undefined, fetch$, this.ui);
    }
}
