import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';

export interface ReportItemDto {
    reportReportingLink: string;
}

export interface ReportResponseDto extends SimpleResponseDto<ReportItemDto> { }
