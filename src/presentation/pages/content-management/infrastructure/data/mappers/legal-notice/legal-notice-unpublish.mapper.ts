import { LegalNoticeUnpublishEntity } from '@pages/content-management/domain/entities/legal-notice/legal-notice-unpublish.entity';
import { LegalNoticeUnpublishApiDto } from '@pages/content-management/infrastructure/api/dto/legal-notice/legal-notice-unpublish-api.dto';

export function legalNoticeUnpublishMapper(
    vo: LegalNoticeUnpublishEntity
): LegalNoticeUnpublishApiDto {
    const prams = {} as LegalNoticeUnpublishApiDto;
    if (vo.uniqId) {
        prams.uniq_id = vo.uniqId;
    }
    return prams;
}
