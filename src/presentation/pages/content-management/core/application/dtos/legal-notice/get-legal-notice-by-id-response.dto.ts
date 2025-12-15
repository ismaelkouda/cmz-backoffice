import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';

export interface GetLegalNoticeByIdResponseDto extends SimpleResponseDto<GetLegalNoticeByIdItemDto> { }


export interface GetLegalNoticeByIdItemDto {
    name: string;
    content: string;
    version: string;
}
