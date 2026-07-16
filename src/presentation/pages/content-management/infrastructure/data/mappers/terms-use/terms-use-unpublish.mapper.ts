import { TermsUseUnpublishDto } from '@pages/content-management/application/dto/terms-use/terms-use-unpublish.dto';
import { TermsUseUnpublishApiDto } from '@pages/content-management/infrastructure/api/dto/terms-use/terms-use-unpublish-api.dto';

export function termsUseUnpublishMapper(
    dto: TermsUseUnpublishDto
): TermsUseUnpublishApiDto {
    const prams = {} as TermsUseUnpublishApiDto;
    if (dto.uniqId) {
        prams.uniq_id = dto.uniqId;
    }
    return prams;
}
