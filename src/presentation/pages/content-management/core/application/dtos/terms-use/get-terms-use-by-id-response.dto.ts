import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';

export type GetTermsUseByIdResponseDto =
    SimpleResponseDto<GetTermsUseByIdItemDto>;

export interface GetTermsUseByIdItemDto {
    name: string;
    content: string;
    version: string;
}
