import { Injectable } from '@angular/core';
import { JobsEntity } from '@pages/reporting/domain/entities/jobs/jobs.entity';
import { JobsRepository } from '@pages/reporting/domain/repositories/jobs-repository.interface';
import { JobsMapper } from '@pages/reporting/infrastructure/data/mappers/jobs.mapper';
import { JobsApi } from '@pages/reporting/infrastructure/data/sources/jobs.api';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class JobsRepositoryImpl implements JobsRepository {
    constructor(
        private readonly api: JobsApi,
        private readonly jobsMapper: JobsMapper
    ) {}

    fetchJobs(): Observable<JobsEntity> {
        return this.api
            .getJobs()
            .pipe(map((response) => this.jobsMapper.mapFromDto(response)));
    }
}
