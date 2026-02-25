import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export type GetTermsUseByIdResponseDto =
    SimpleResponseDto<GetTermsUseByIdItemDto>;

export interface GetTermsUseByIdItemDto {
    name: string;
    content: string;
    version: string;
}
