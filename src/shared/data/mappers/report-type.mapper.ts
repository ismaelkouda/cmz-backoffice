import { Injectable } from '@angular/core';

import { ReportTypeDto } from '@shared/data/dtos/report-type.dto';
import { ReportType } from '@shared/domain/enums/report-type.enum';

@Injectable({
    providedIn: 'root',
})
export class ReportTypeMapper {
    mapToEnum(dtoValue: ReportTypeDto): ReportType {
        const methodMap: Record<ReportTypeDto, ReportType> = {
            [ReportTypeDto.ABI]: ReportType.ABI,
            [ReportTypeDto.ZOB]: ReportType.ZOB,
            [ReportTypeDto.CPS]: ReportType.CPS,
            [ReportTypeDto.CPO]: ReportType.CPO,
        };
        return methodMap[dtoValue];
    }

    mapToDto(enumValue: ReportType): ReportTypeDto {
        const mapping: Record<ReportType, ReportTypeDto> = {
            [ReportType.ABI]: ReportTypeDto.ABI,
            [ReportType.ZOB]: ReportTypeDto.ZOB,
            [ReportType.CPS]: ReportTypeDto.CPS,
            [ReportType.CPO]: ReportTypeDto.CPO,
        };
        return mapping[enumValue];
    }
}
