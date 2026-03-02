import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export type GetLegalNoticeByIdResponseDto =
    SimpleResponseDto<GetLegalNoticeByIdItemDto>;

export interface GetLegalNoticeByIdItemDto {
    name: string;
    content: string;
    version: string;
}
