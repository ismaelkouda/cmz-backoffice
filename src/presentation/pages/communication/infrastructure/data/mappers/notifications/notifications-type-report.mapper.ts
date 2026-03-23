import { Injectable } from '@angular/core';
import { TypeReportApiDto } from '@pages/communication/infrastructure/api/dto/notifications/notifications-type-report-api.dto';
import { TypeReport } from '@shared/domain/enums/type-report.enum';

@Injectable({ providedIn: 'root' })
export class TypeReportMapper {
    mapFromDto(dto: TypeReportApiDto): TypeReport {
        const methodMap: Record<TypeReportApiDto, TypeReport> = {
            [TypeReportApiDto.REQUESTS]: TypeReport.REQUESTS,
            [TypeReportApiDto.PROCESSING]: TypeReport.PROCESSING,
            [TypeReportApiDto.FINALIZATION]: TypeReport.FINALIZATION,
        };
        return methodMap[dto];
    }
    mapToDto(value: TypeReport): TypeReportApiDto {
        const methodMap: Record<TypeReport, TypeReportApiDto> = {
            [TypeReport.REQUESTS]: TypeReportApiDto.REQUESTS,
            [TypeReport.PROCESSING]: TypeReportApiDto.PROCESSING,
            [TypeReport.FINALIZATION]: TypeReportApiDto.FINALIZATION,
        };
        return methodMap[value];
    }
}
