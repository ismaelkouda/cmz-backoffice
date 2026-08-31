import { Injectable } from '@angular/core';
import { ReportByEquipmentsEntity } from '@pages/reporting/domain/entities/report-by-equipments/report-by-equipments.entity';
import { ReportByEquipmentsItemDto } from '@pages/reporting/infrastructure/api/dto/report-by-equipments/report-by-equipments-response.dto';
import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';

@Injectable({ providedIn: 'root' })
export class ReportByEquipmentsMapper extends SimpleResponseMapper<
    ReportByEquipmentsEntity,
    ReportByEquipmentsItemDto
> {
    protected override mapItemFromDto(
        dto: ReportByEquipmentsItemDto
    ): ReportByEquipmentsEntity {
        return new ReportByEquipmentsEntity(dto.impactsOnEquipments);
    }
}
