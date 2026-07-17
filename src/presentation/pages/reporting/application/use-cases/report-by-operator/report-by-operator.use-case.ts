import { Injectable, inject } from '@angular/core';
import { ReportByOperatorEntity } from '@pages/reporting/domain/entities/report-by-operator/report-by-operator.entity';
import { ReportByOperatorRepository } from '@pages/reporting/domain/repositories/report-by-operator-repository.interface';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ReportByOperatorUseCase {
    private readonly repository = inject(ReportByOperatorRepository);

    execute(options?: FetchOptions): Observable<ReportByOperatorEntity> {
        return this.repository.getReportByOperator(options);
    }
}
