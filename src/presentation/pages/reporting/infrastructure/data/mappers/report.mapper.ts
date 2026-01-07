import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';
import { ReportEntity } from '../../../core/domain/entities/report/report.entity';
import { ReportItemDto } from '../../api/dtos/report/report-response.dto';

export class ReportMapper extends SimpleResponseMapper<
    ReportEntity,
    ReportItemDto
> {
    protected override mapItemFromDto(dto: ReportItemDto): ReportEntity {
        return new ReportEntity(dto.reportReportingLink);
    }
}
