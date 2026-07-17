import { Injectable } from '@angular/core';
import { ReportByOperatorEntity } from '@pages/reporting/domain/entities/report-by-operator/report-by-operator.entity';
import { ReportByOperatorItemDto } from '@pages/reporting/infrastructure/api/dto/report-by-operator/report-by-operator-response.dto';
import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';

@Injectable({ providedIn: 'root' })
export class ReportByOperatorMapper extends SimpleResponseMapper<
    ReportByOperatorEntity,
    ReportByOperatorItemDto
> {
    protected override mapItemFromDto(
        dto: ReportByOperatorItemDto
    ): ReportByOperatorEntity {
        return new ReportByOperatorEntity(dto.reportByOperator);
    }
}
