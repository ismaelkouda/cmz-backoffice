import { Injectable, inject } from '@angular/core';
import { JobsEntity } from '@pages/reporting/domain/entities/jobs/jobs.entity';
import { JobsRepository } from '@pages/reporting/domain/repositories/jobs-repository.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class JobsUseCase {
    private readonly repository = inject(JobsRepository);

    execute(): Observable<JobsEntity> {
        return this.repository.fetchJobs();
    }
}
