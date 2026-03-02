import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface RequestItemDto {
    requestReportReportingLink: string;
}

export type RequestResponseDto = SimpleResponseDto<RequestItemDto>;
