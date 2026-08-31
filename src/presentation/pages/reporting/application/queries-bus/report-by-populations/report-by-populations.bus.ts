import { Injectable, inject } from '@angular/core';
import { ReportByPopulationsHandler } from '@pages/reporting/application/queries-handlers/report-by-populations/report-by-populations.handler';
import { ReportByPopulationsEntity } from '@pages/reporting/domain/entities/report-by-populations/report-by-populations.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReportByPopulationsBus {
    private readonly handler = inject(ReportByPopulationsHandler);

    dispatch(options?: FetchOptions): Observable<ReportByPopulationsEntity> {
        return this.handler.execute(options);
    }
}
