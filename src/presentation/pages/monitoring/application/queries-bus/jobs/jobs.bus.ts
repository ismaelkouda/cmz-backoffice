import { Injectable, inject } from '@angular/core';
import { JobsHandler } from '@presentation/pages/monitoring/application/queries-handlers/jobs/jobs.handler';
import { JobsEntity } from '@presentation/pages/monitoring/domain/entities/jobs/jobs.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class JobsBus {
    private readonly filterHandler = inject(JobsHandler);

    dispatch(options?: FetchOptions): Observable<JobsEntity> {
        return this.filterHandler.execute(options);
    }
}
