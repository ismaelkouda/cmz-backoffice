import { Injectable, inject } from '@angular/core';
import { ReportsUseCase } from '@pages/reporting/application/use-cases/reports/reports.use-case';
import { ReportsEntity } from '@pages/reporting/domain/entities/reports/reports.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReportsHandler {
    private readonly useCase = inject(ReportsUseCase);

    execute(options?: FetchOptions): Observable<ReportsEntity> {
        return this.useCase.execute(options);
    }
}
