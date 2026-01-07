import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';

export interface GetTermsUseByIdResponseDto
    extends SimpleResponseDto<GetTermsUseByIdItemDto> {}

export interface GetTermsUseByIdItemDto {
    name: string;
    content: string;
    version: string;
}
