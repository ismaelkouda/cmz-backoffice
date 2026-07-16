import { LegalNoticeCreateValidateContract } from '@pages/content-management/domain/contracts/legal-notice/legal-notice-create.validate-contract';
import { LegalNoticeCreateApiDto } from '@pages/content-management/infrastructure/api/dto/legal-notice/legal-notice-create-api.dto';

export function legalNoticeCreateMapper(
    contract: LegalNoticeCreateValidateContract
): LegalNoticeCreateApiDto {
    const params: LegalNoticeCreateApiDto = {} as LegalNoticeCreateApiDto;

    if (contract.version) {
        params.version = contract.version;
    }
    if (contract.content) {
        params.content = contract.content;
    }

    return params;
}
