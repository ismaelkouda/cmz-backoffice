import { JobsEntity } from '@pages/reporting/domain/entities/jobs/jobs.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

export abstract class JobsRepository {
    abstract fetchJobs(options?: FetchOptions): Observable<JobsEntity>;
}
