import { TermsUseDeleteDto } from '@pages/content-management/application/dto/terms-use/terms-use-delete.dto';
import { TermsUseDeleteApiDto } from '@pages/content-management/infrastructure/api/dto/terms-use/terms-use-delete-api.dto';

export function termsUseDeleteMapper(
    dto: TermsUseDeleteDto
): TermsUseDeleteApiDto {
    const prams = {} as TermsUseDeleteApiDto;
    if (dto.uniqId) {
        prams.uniq_id = dto.uniqId;
    }
    return prams;
}
