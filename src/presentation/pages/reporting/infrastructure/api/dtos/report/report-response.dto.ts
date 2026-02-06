import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';

export interface ReportItemDto {
    reportReportingLink: string;
}

export type ReportResponseDto = SimpleResponseDto<ReportItemDto>;
