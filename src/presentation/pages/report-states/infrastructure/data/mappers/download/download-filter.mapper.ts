import { inject, Injectable } from '@angular/core';
import { DownloadFilterContract } from '@pages/report-states/domain/contracts/download/download-filter.contract';
import { DownloadFilterApiDto } from '@pages/report-states/infrastructure/api/dto/download/download-filter-api.dto';
import { ReportTypeMapper } from '@shared/data/mappers/report-type.mapper';
import { StatusMapper } from '@pages/report-states/infrastructure/data/mappers/download/download-status.mapper';
import { ApiDateMapper } from '@shared/data/mappers/api-date.mapper';

@Injectable({
    providedIn: 'root',
})
export class DownloadFilterMapper {
    private readonly reportTypeMapper = inject(ReportTypeMapper);
    private readonly statusMapper = inject(StatusMapper);
    private readonly apiDateMapper = inject(ApiDateMapper);

    map(entity: DownloadFilterContract): DownloadFilterApiDto {
        return {
            ...(entity.search && {
                search: entity.search,
            }),
            ...(entity?.date && {
                date: this.apiDateMapper.toDateApi(entity.date),
            }),
            ...(entity.initiatorPhoneNumber && {
                initiator_phone_number: entity.initiatorPhoneNumber,
            }),
            ...(entity.uniqId && { uniq_id: entity.uniqId }),
            // ...(entity.reportType && {
            //     report_type: this.reportTypeMapper.mapToDto(entity.reportType),
            // }),
            ...(entity.reportType && {
                report_type: entity.reportType,
            }),
            ...(entity.operators && { operators: entity.operators }),
            ...(entity.source && { source: entity.source }),
            ...(entity.status && {
                status: this.statusMapper.mapStatusToApi(entity.status),
            }),
            ...(entity?.startDate && {
                start_date: this.apiDateMapper.toDateApi(entity.startDate),
            }),
            ...(entity?.endDate && {
                end_date: this.apiDateMapper.toDateApi(entity.endDate),
            }),
        };
    }
}
