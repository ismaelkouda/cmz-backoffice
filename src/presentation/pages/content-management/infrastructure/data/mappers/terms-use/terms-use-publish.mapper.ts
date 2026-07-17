import { TermsUsePublishDto } from '@pages/content-management/application/dto/terms-use/terms-use-publish.dto';
import { TermsUsePublishApiDto } from '@pages/content-management/infrastructure/api/dto/terms-use/terms-use-publish-api.dto';

export function termsUsePublishMapper(
    dto: TermsUsePublishDto
): TermsUsePublishApiDto {
    const prams = {} as TermsUsePublishApiDto;
    if (dto.uniqId) {
        prams.uniq_id = dto.uniqId;
    }
    return prams;
}
