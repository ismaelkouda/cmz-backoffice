import { Injectable, inject } from '@angular/core';
import { JobsHandler } from '@pages/reporting/application/queries-handlers/jobs/jobs.handler';
import { JobsEntity } from '@pages/reporting/domain/entities/jobs/jobs.entity';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class JobsBus {
    private readonly filterHandler = inject(JobsHandler);

    dispatch(): Observable<JobsEntity> {
        return this.filterHandler.execute();
    }
}
