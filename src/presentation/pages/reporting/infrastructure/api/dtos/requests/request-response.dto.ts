import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';

export interface RequestItemDto {
    requestReportReportingLink: string;
}

export type RequestResponseDto = SimpleResponseDto<RequestItemDto>;
