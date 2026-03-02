import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export type GetPrivacyPolicyByIdResponseDto =
    SimpleResponseDto<GetPrivacyPolicyByIdItemDto>;

export interface GetPrivacyPolicyByIdItemDto {
    name: string;
    content: string;
    version: string;
}
