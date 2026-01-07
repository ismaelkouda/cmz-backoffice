import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';

export interface GetPrivacyPolicyByIdResponseDto
    extends SimpleResponseDto<GetPrivacyPolicyByIdItemDto> {}

export interface GetPrivacyPolicyByIdItemDto {
    name: string;
    content: string;
    version: string;
}
