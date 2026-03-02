import { TermsUsePublishEntity } from '@presentation/pages/content-management/domain/entities/terms-use/terms-use-publish.entity';
import { TermsUsePublishApiDto } from '@presentation/pages/content-management/infrastructure/api/dto/terms-use/terms-use-publish-api.dto';

export function termsUsePublishMapper(
    vo: TermsUsePublishEntity
): TermsUsePublishApiDto {
    const prams = {} as TermsUsePublishApiDto;
    if (vo.uniqId) {
        prams.uniq_id = vo.uniqId;
    }
    return prams;
}
