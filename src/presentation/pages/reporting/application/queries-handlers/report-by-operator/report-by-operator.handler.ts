import { Injectable, inject } from '@angular/core';
import { ReportByOperatorUseCase } from '@pages/reporting/application/use-cases/report-by-operator/report-by-operator.use-case';
import { ReportByOperatorEntity } from '@pages/reporting/domain/entities/report-by-operator/report-by-operator.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReportByOperatorHandler {
    private readonly useCase = inject(ReportByOperatorUseCase);

    execute(options?: FetchOptions): Observable<ReportByOperatorEntity> {
        return this.useCase.execute(options);
    }
}
