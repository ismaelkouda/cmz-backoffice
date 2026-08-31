import { Injectable, inject } from '@angular/core';
import { ReportByPopulationsUseCase } from '@pages/reporting/application/use-cases/report-by-populations/report-by-populations.use-case';
import { ReportByPopulationsEntity } from '@pages/reporting/domain/entities/report-by-populations/report-by-populations.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReportByPopulationsHandler {
    private readonly useCase = inject(ReportByPopulationsUseCase);

    execute(options?: FetchOptions): Observable<ReportByPopulationsEntity> {
        return this.useCase.execute(options);
    }
}
