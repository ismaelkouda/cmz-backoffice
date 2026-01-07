import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';

export interface RequestItemDto {
    requestReportReportingLink: string;
}

export interface RequestResponseDto extends SimpleResponseDto<RequestItemDto> { }
