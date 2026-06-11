import { Injectable, inject } from '@angular/core';
import { JobsUseCase } from '@pages/reporting/application/use-cases/jobs/jobs.use-case';
import { JobsEntity } from '@pages/reporting/domain/entities/jobs/jobs.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class JobsHandler {
    private readonly useCase = inject(JobsUseCase);

    execute(options?: FetchOptions): Observable<JobsEntity> {
        return this.useCase.execute(options);
    }
}
