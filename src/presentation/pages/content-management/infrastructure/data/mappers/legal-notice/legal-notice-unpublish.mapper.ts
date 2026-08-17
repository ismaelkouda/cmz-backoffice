import { LegalNoticeUnpublishDto } from '@pages/content-management/application/dto/legal-notice/legal-notice-unpublish.dto';
import { LegalNoticeUnpublishApiDto } from '@pages/content-management/infrastructure/api/dto/legal-notice/legal-notice-unpublish-api.dto';

export function legalNoticeUnpublishMapper(
    dto: LegalNoticeUnpublishDto
): LegalNoticeUnpublishApiDto {
    const prams = {} as LegalNoticeUnpublishApiDto;
    if (dto.uniqId) {
        prams.uniq_id = dto.uniqId;
    }
    return prams;
}
