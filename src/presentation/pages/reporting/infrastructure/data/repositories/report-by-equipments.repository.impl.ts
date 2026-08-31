import { Injectable, inject } from '@angular/core';
import { ReportByEquipmentsEntity } from '@pages/reporting/domain/entities/report-by-equipments/report-by-equipments.entity';
import { ReportByEquipmentsRepository } from '@pages/reporting/domain/repositories/report-by-equipments-repository.interface';
import { ReportByEquipmentsMapper } from '@pages/reporting/infrastructure/data/mappers/report-by-equipments.mapper';
import { ReportByEquipmentsApi } from '@pages/reporting/infrastructure/data/sources/report-by-equipments.api';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReportByEquipmentsRepositoryImpl implements ReportByEquipmentsRepository {
    private readonly api = inject(ReportByEquipmentsApi);
    private readonly reportByEquipmentsMapper = inject(
        ReportByEquipmentsMapper
    );

    getReportByEquipments(
        options?: FetchOptions
    ): Observable<ReportByEquipmentsEntity> {
        return this.api
            .getReportByEquipments(options)
            .pipe(
                map((response) =>
                    this.reportByEquipmentsMapper.mapFromDto(response)
                )
            );
    }
}
