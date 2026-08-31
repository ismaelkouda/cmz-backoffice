import { Injectable, inject } from '@angular/core';
import { ReportByEquipmentsEntity } from '@pages/reporting/domain/entities/report-by-equipments/report-by-equipments.entity';
import { ReportByEquipmentsRepository } from '@pages/reporting/domain/repositories/report-by-equipments-repository.interface';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ReportByEquipmentsUseCase {
    private readonly repository = inject(ReportByEquipmentsRepository);

    execute(options?: FetchOptions): Observable<ReportByEquipmentsEntity> {
        return this.repository.getReportByEquipments(options);
    }
}
