import { Injectable } from '@angular/core';
import { ReportSourceDto } from '@shared/data/dto/report-source.dto';
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
    ]);
    mapToEnum(dtoValue: ReportSourceDto): ReportSource {
        if (dtoValue === null || dtoValue === undefined) {
            return ReportSource.APP;
        }
        return ReportSourceMapper.MAP.get(dtoValue) || ReportSource.APP;
    }
}
