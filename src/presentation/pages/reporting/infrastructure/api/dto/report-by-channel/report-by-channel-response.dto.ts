import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface ReportByChannelItemDto {
    reportByChannel: string;
}

export type ReportByChannelResponseDto =
    SimpleResponseDto<ReportByChannelItemDto>;
