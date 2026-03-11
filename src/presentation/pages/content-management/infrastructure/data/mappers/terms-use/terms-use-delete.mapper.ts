import { TermsUseDeleteEntity } from '@pages/content-management/domain/entities/terms-use/terms-use-delete.entity';
import { TermsUseDeleteApiDto } from '@pages/content-management/infrastructure/api/dto/terms-use/terms-use-delete-api.dto';

export function termsUseDeleteMapper(
    vo: TermsUseDeleteEntity
): TermsUseDeleteApiDto {
    const prams = {} as TermsUseDeleteApiDto;
    if (vo.uniqId) {
        prams.uniq_id = vo.uniqId;
    }
    return prams;
}
