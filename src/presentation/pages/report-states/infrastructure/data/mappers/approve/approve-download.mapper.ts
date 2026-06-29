import { inject, Injectable } from '@angular/core';
import { ApproveDownloadEntity } from '@pages/report-states/domain/entities/approve/approve-download.entity';
import { ApproveDownloadApiDto } from '@pages/report-states/infrastructure/api/dto/approve/approve-download-api.dto';
import { ReportTypeMapper } from '@shared/data/mappers/report-type.mapper';
import { DownloadTypeMapper } from '@pages/report-states/infrastructure/data/mappers/download-type.mapper';

@Injectable({
    providedIn: 'root',
})
export class ApproveDownloadMapper {
    private readonly reportTypeMapper = inject(ReportTypeMapper);
    private readonly downloadTypeMapper = inject(DownloadTypeMapper);
    map(entity: ApproveDownloadEntity): ApproveDownloadApiDto {
        return {
            ...(entity.data.metaData.source && {
                entity_type: entity.data.metaData.source,
            }),
            ...(entity.data.format && {
                format: this.downloadTypeMapper.mapToDto(entity.data.format),
            }),
            ...(entity.data.initiatorPhoneNumber && {
                initiator_phone_number: entity.data.initiatorPhoneNumber,
            }),
            ...(entity.data.uniqId && { uniq_id: entity.data.uniqId }),
            // ...(entity.data.reportType && {
            //     report_type: this.reportTypeMapper.mapToDto(entity.data.reportType),
            // }),
            ...(entity.data.reportType && {
                report_type: entity.data.reportType,
            }),
            ...(entity.data.operators && { operators: entity.data.operators }),
            ...(entity.data.source && { source: entity.data.source }),
            ...(entity.data.startDate && {
                start_date: entity.data.startDate,
            }),
            ...(entity.data.endDate && {
                end_date: entity.data.endDate,
            }),
        };
    }
}
