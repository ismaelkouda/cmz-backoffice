import { Injectable, inject } from '@angular/core';
import { JobsEntity } from '@pages/reporting/domain/entities/jobs/jobs.entity';
import { JobsRepository } from '@pages/reporting/domain/repositories/jobs-repository.interface';
import { JobsMapper } from '@pages/reporting/infrastructure/data/mappers/jobs.mapper';
import { JobsApi } from '@pages/reporting/infrastructure/data/sources/jobs.api';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class JobsRepositoryImpl implements JobsRepository {
    private readonly api = inject(JobsApi);
    private readonly jobsMapper = inject(JobsMapper);

    fetchJobs(options?: FetchOptions): Observable<JobsEntity> {
        return this.api
            .getJobs(options)
            .pipe(map((response) => this.jobsMapper.mapFromDto(response)));
    }
}
