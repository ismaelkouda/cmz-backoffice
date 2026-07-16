import { TermsUseCreateValidateContract } from '@pages/content-management/domain/contracts/terms-use/terms-use-create.validate-contract';
import { TermsUseCreateApiDto } from '@pages/content-management/infrastructure/api/dto/terms-use/terms-use-create-api.dto';

export function termsUseCreateMapper(
    contract: TermsUseCreateValidateContract
): TermsUseCreateApiDto {
    const params: TermsUseCreateApiDto = {} as TermsUseCreateApiDto;

    if (contract.version) {
        params.version = contract.version;
    }
    if (contract.content) {
        params.content = contract.content;
    }

    return params;
}
