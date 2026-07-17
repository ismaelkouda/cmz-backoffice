import { LegalNoticePublishDto } from '@pages/content-management/application/dto/legal-notice/legal-notice-publish.dto';
import { LegalNoticePublishApiDto } from '@pages/content-management/infrastructure/api/dto/legal-notice/legal-notice-publish-api.dto';

export function legalNoticePublishMapper(
    dto: LegalNoticePublishDto
): LegalNoticePublishApiDto {
    const prams = {} as LegalNoticePublishApiDto;
    if (dto.uniqId) {
        prams.uniq_id = dto.uniqId;
    }
    return prams;
}
