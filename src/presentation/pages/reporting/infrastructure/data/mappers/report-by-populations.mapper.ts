import { Injectable } from '@angular/core';
import { ReportByPopulationsEntity } from '@pages/reporting/domain/entities/report-by-populations/report-by-populations.entity';
import { ReportByPopulationsItemDto } from '@pages/reporting/infrastructure/api/dto/report-by-populations/report-by-populations-response.dto';
import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';

@Injectable({ providedIn: 'root' })
export class ReportByPopulationsMapper extends SimpleResponseMapper<
    ReportByPopulationsEntity,
    ReportByPopulationsItemDto
> {
    protected override mapItemFromDto(
        dto: ReportByPopulationsItemDto
    ): ReportByPopulationsEntity {
        return new ReportByPopulationsEntity(dto.impactsOnPopulations);
    }
}
