import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface ReportByOperatorItemDto {
    reportByOperator: string;
}

export type ReportByOperatorResponseDto =
    SimpleResponseDto<ReportByOperatorItemDto>;
