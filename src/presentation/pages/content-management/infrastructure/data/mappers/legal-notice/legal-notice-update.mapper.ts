import { LegalNoticeUpdateValidateContract } from '@pages/content-management/domain/contracts/legal-notice/legal-notice-update.validate-contract';
import { LegalNoticeUpdateApiDto } from '@pages/content-management/infrastructure/api/dto/legal-notice/legal-notice-update-api.dto';

export function legalNoticeUpdateMapper(
    contract: LegalNoticeUpdateValidateContract
): LegalNoticeUpdateApiDto {
    const params: LegalNoticeUpdateApiDto = {} as LegalNoticeUpdateApiDto;

    if (contract.uniqId) {
        params.id = contract.uniqId;
    }
    if (contract.version) {
        params.version = contract.version;
    }
    if (contract.content) {
        params.content = contract.content;
    }

    return params;
}
