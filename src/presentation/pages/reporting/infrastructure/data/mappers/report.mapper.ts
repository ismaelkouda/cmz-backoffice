import { Injectable } from '@angular/core';
import { ReportsEntity } from '@pages/reporting/domain/entities/reports/reports.entity';
import { ReportItemDto } from '@pages/reporting/infrastructure/api/dto/report/report-response.dto';
import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';

@Injectable({ providedIn: 'root' })
export class ReportMapper extends SimpleResponseMapper<
    ReportsEntity,
    ReportItemDto
> {
    protected override mapItemFromDto(dto: ReportItemDto): ReportsEntity {
        return new ReportsEntity(dto.reportReportingLink);
    }
}
