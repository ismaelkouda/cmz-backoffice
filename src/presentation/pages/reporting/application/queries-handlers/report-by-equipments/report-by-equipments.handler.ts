import { Injectable, inject } from '@angular/core';
import { ReportByEquipmentsUseCase } from '@pages/reporting/application/use-cases/report-by-equipments/report-by-equipments.use-case';
import { ReportByEquipmentsEntity } from '@pages/reporting/domain/entities/report-by-equipments/report-by-equipments.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReportByEquipmentsHandler {
    private readonly useCase = inject(ReportByEquipmentsUseCase);

    execute(options?: FetchOptions): Observable<ReportByEquipmentsEntity> {
        return this.useCase.execute(options);
    }
}
