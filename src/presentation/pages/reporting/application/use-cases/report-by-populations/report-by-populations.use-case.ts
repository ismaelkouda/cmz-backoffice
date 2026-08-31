import { Injectable, inject } from '@angular/core';
import { ReportByPopulationsEntity } from '@pages/reporting/domain/entities/report-by-populations/report-by-populations.entity';
import { ReportByPopulationsRepository } from '@pages/reporting/domain/repositories/report-by-populations-repository.interface';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ReportByPopulationsUseCase {
    private readonly repository = inject(ReportByPopulationsRepository);

    execute(options?: FetchOptions): Observable<ReportByPopulationsEntity> {
        return this.repository.getReportByPopulations(options);
    }
}
