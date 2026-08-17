import { Injectable, inject } from '@angular/core';
import { ReportByOperatorHandler } from '@pages/reporting/application/queries-handlers/report-by-operator/report-by-operator.handler';
import { ReportByOperatorEntity } from '@pages/reporting/domain/entities/report-by-operator/report-by-operator.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReportByOperatorBus {
    private readonly filterHandler = inject(ReportByOperatorHandler);

    dispatch(options?: FetchOptions): Observable<ReportByOperatorEntity> {
        return this.filterHandler.execute(options);
    }
}
