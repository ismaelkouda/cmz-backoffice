import { Injectable } from '@angular/core';
import { ReportTypeDto } from '@shared/data/dtos/report-type.dto';
import { ReportType } from '@shared/domain/enums/report-type.enum';

@Injectable({
    providedIn: 'root',
})
export class ReportTypeMapper {
    mapToEnum(dtoValue: ReportTypeDto): ReportType {
        if (dtoValue == null) {
            return ReportType.UNKNOWN;
        }
        const methodMap: Record<ReportTypeDto, ReportType> = {
            [ReportTypeDto.ABI]: ReportType.ABI,
            [ReportTypeDto.ZOB]: ReportType.ZOB,
            [ReportTypeDto.CPS]: ReportType.CPS,
            [ReportTypeDto.CPO]: ReportType.CPO,
            [ReportTypeDto.UNKNOWN]: ReportType.UNKNOWN,
        };
        return methodMap[dtoValue] || ReportType.UNKNOWN;
    }

    mapToDto(enumValue: ReportType): ReportTypeDto {
        if (enumValue == null) {
            return ReportTypeDto.UNKNOWN;
        }
        const mapping: Record<ReportType, ReportTypeDto> = {
            [ReportType.ABI]: ReportTypeDto.ABI,
            [ReportType.ZOB]: ReportTypeDto.ZOB,
            [ReportType.CPS]: ReportTypeDto.CPS,
            [ReportType.CPO]: ReportTypeDto.CPO,
            [ReportType.UNKNOWN]: ReportTypeDto.UNKNOWN,
        };
        return mapping[enumValue] || ReportTypeDto.UNKNOWN;
    }
}
