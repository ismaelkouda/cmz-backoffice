import { Injectable, inject } from '@angular/core';
import { ReportByEquipmentsHandler } from '@pages/reporting/application/queries-handlers/report-by-equipments/report-by-equipments.handler';
import { ReportByEquipmentsEntity } from '@pages/reporting/domain/entities/report-by-equipments/report-by-equipments.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReportByEquipmentsBus {
    private readonly handler = inject(ReportByEquipmentsHandler);

    dispatch(options?: FetchOptions): Observable<ReportByEquipmentsEntity> {
        return this.handler.execute(options);
    }
}
