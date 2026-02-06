import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';

export type GetLegalNoticeByIdResponseDto =
    SimpleResponseDto<GetLegalNoticeByIdItemDto>;

export interface GetLegalNoticeByIdItemDto {
    name: string;
    content: string;
    version: string;
}
