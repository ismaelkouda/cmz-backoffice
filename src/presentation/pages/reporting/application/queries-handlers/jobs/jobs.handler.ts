import { Injectable } from '@angular/core';
import { JobsUseCase } from '@pages/reporting/application/use-cases/jobs/jobs.use-case';
import { JobsEntity } from '@pages/reporting/domain/entities/jobs/jobs.entity';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class JobsHandler {
    constructor(private readonly useCase: JobsUseCase) {}

    execute(): Observable<JobsEntity> {
        return this.useCase.execute();
    }
}
