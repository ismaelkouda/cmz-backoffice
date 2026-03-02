import { LegalNoticePublishEntity } from '@presentation/pages/content-management/domain/entities/legal-notice/legal-notice-publish.entity';
import { LegalNoticePublishApiDto } from '@presentation/pages/content-management/infrastructure/api/dto/legal-notice/legal-notice-publish-api.dto';

export function legalNoticePublishMapper(
    vo: LegalNoticePublishEntity
): LegalNoticePublishApiDto {
    const prams = {} as LegalNoticePublishApiDto;
    if (vo.uniqId) {
        prams.uniq_id = vo.uniqId;
    }
    return prams;
}
