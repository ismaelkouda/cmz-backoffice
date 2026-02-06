import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';

export type GetPrivacyPolicyByIdResponseDto =
    SimpleResponseDto<GetPrivacyPolicyByIdItemDto>;

export interface GetPrivacyPolicyByIdItemDto {
    name: string;
    content: string;
    version: string;
}
