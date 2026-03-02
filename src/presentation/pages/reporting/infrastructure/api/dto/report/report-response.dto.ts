import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface ReportItemDto {
    reportReportingLink: string;
}

export type ReportResponseDto = SimpleResponseDto<ReportItemDto>;
