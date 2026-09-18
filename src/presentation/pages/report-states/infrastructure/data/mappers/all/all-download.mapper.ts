import { Injectable } from '@angular/core';
import { AllDownloadApiDto } from '@pages/report-states/infrastructure/api/dto/all/all-download-api.dto';
import { AllDownloadEntity } from '@presentation/pages/report-states/domain/entities/all/all-download.entity';

@Injectable({ providedIn: 'root' })
export class AllDownloadMapper {
    map(entity: AllDownloadEntity): AllDownloadApiDto {
        return {
            ...(entity.data.format && {
                format: entity.data.format,
            }),
            ...(entity.data.initiatorPhoneNumber && {
                initiatorPhoneNumber: entity.data.initiatorPhoneNumber,
            }),
            ...(entity.data.uniqId && { uniqId: entity.data.uniqId }),
            ...(entity.data.requestReportUniqId && {
                requestReportUniqId: entity.data.requestReportUniqId,
            }),
            ...(entity.data.reportType && {
                reportType: entity.data.reportType,
            }),
            ...(entity.data.operators && { operators: entity.data.operators }),
            ...(entity.data.source && { source: entity.data.source }),
            ...(entity.data.startDate && {
                startDate: entity.data.startDate,
            }),
            ...(entity.data.endDate && {
                endDate: entity.data.endDate,
            }),
        };
    }
}
