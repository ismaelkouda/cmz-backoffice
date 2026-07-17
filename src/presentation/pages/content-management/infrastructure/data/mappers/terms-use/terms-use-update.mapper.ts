import { TermsUseUpdateValidateContract } from '@pages/content-management/domain/contracts/terms-use/terms-use-update.validate-contract';
import { TermsUseUpdateApiDto } from '@pages/content-management/infrastructure/api/dto/terms-use/terms-use-update-api.dto';

export function termsUseUpdateMapper(
    contract: TermsUseUpdateValidateContract
): TermsUseUpdateApiDto {
    const params: TermsUseUpdateApiDto = {} as TermsUseUpdateApiDto;

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
