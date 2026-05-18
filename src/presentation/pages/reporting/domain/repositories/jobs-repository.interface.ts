import { JobsEntity } from '@pages/reporting/domain/entities/jobs/jobs.entity';
import { Observable } from 'rxjs';

export abstract class JobsRepository {
    abstract fetchJobs(): Observable<JobsEntity>;
}
