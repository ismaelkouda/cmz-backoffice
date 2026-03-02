import { TermsUseUnpublishEntity } from '@presentation/pages/content-management/domain/entities/terms-use/terms-use-unpublish.entity';
import { TermsUseUnpublishApiDto } from '@presentation/pages/content-management/infrastructure/api/dto/terms-use/terms-use-unpublish-api.dto';

export function termsUseUnpublishMapper(
    vo: TermsUseUnpublishEntity
): TermsUseUnpublishApiDto {
    const prams = {} as TermsUseUnpublishApiDto;
    if (vo.uniqId) {
        prams.uniq_id = vo.uniqId;
    }
    return prams;
}
