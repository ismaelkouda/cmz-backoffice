import { ReportByEquipmentsEntity } from '@pages/reporting/domain/entities/report-by-equipments/report-by-equipments.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

export abstract class ReportByEquipmentsRepository {
    abstract getReportByEquipments(
        options?: FetchOptions
    ): Observable<ReportByEquipmentsEntity>;
}
