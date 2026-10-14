import { inject, Injectable } from '@angular/core';
import { RequestDownloadEntity } from '@pages/report-states/domain/entities/request/request-download.entity';
import { RequestDownloadApiDto } from '@pages/report-states/infrastructure/api/dto/request/request-download-api.dto';
import { DownloadTypeMapper } from '@pages/report-states/infrastructure/data/mappers/download-type.mapper';

@Injectable({
    providedIn: 'root',
})
export class RequestDownloadMapper {
    private readonly downloadTypeMapper = inject(DownloadTypeMapper);
    map(entity: RequestDownloadEntity): RequestDownloadApiDto {
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
            ...(entity.data.requestReportUniqId && {
                report_uniq_id: entity.data.requestReportUniqId,
            }),
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
