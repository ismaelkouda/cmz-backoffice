import { Injectable, inject } from '@angular/core';
import { ReportsHandler } from '@pages/reporting/application/queries-handlers/reports/reports.handler';
import { ReportsEntity } from '@pages/reporting/domain/entities/reports/reports.entity';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReportsBus {
    private readonly filterHandler = inject(ReportsHandler);

    dispatch(): Observable<ReportsEntity> {
        return this.filterHandler.execute();
    }
}
