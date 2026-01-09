import { Injectable } from '@angular/core';
import { ReportSourceDto } from '@shared/data/dtos/report-source.dto';
import { ReportSource } from '@shared/domain/enums/report-source.enum';

@Injectable({
    providedIn: 'root',
})
export class ReportSourceMapper {
    private static readonly MAP = new Map<ReportSourceDto, ReportSource>([
        [ReportSourceDto.APP, ReportSource.APP],
        [ReportSourceDto.PWA, ReportSource.PWA],
        [ReportSourceDto.USSD, ReportSource.USSD],
        [ReportSourceDto.SMS, ReportSource.SMS],
        [ReportSourceDto.IVR, ReportSource.IVR],
        [ReportSourceDto.UNKNOWN, ReportSource.UNKNOWN],
    ]);
    mapToEnum(dtoValue: ReportSourceDto): ReportSource {
        if (dtoValue == null) {
            return ReportSource.UNKNOWN;
        }
        return ReportSourceMapper.MAP.get(dtoValue) || ReportSource.UNKNOWN;
    }
}
