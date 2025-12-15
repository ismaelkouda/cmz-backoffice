import { Injectable } from "@angular/core";
import { ReportSourceDto } from "@shared/data/dtos/report-source.dto";
import { ReportSource } from "@shared/domain/enums/report-source.enum";

@Injectable({
    providedIn: 'root'
})
export class ReportSourceMapper {
    mapToEnum(dtoValue: ReportSourceDto): ReportSource {
        if (dtoValue == null) {
            return ReportSource.UNKNOWN;
        }
        const methodMap: Record<ReportSourceDto, ReportSource> = {
            [ReportSourceDto.APP]: ReportSource.APP,
            [ReportSourceDto.PWA]: ReportSource.PWA,
            [ReportSourceDto.USSD]: ReportSource.USSD,
            [ReportSourceDto.SMS]: ReportSource.SMS,
            [ReportSourceDto.IVR]: ReportSource.IVR,
            [ReportSourceDto.UNKNOWN]: ReportSource.UNKNOWN,
        };
        return methodMap[dtoValue] || ReportSource.UNKNOWN;
    }

    mapToDto(enumValue: ReportSource): ReportSourceDto {
        if (enumValue == null) {
            return ReportSourceDto.UNKNOWN;
        }
        const mapping: Record<ReportSource, ReportSourceDto> = {
            [ReportSource.APP]: ReportSourceDto.APP,
            [ReportSource.PWA]: ReportSourceDto.PWA,
            [ReportSource.USSD]: ReportSourceDto.USSD,
            [ReportSource.SMS]: ReportSourceDto.SMS,
            [ReportSource.IVR]: ReportSourceDto.IVR,
            [ReportSource.UNKNOWN]: ReportSourceDto.UNKNOWN,
        };
        return mapping[enumValue] || ReportSourceDto.UNKNOWN;
    }
}