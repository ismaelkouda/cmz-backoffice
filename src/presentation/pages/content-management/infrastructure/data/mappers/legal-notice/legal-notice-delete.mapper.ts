import { LegalNoticeDeleteDto } from '@pages/content-management/application/dto/legal-notice/legal-notice-delete.dto';
import { LegalNoticeDeleteApiDto } from '@pages/content-management/infrastructure/api/dto/legal-notice/legal-notice-delete-api.dto';

export function legalNoticeDeleteMapper(
    dto: LegalNoticeDeleteDto
): LegalNoticeDeleteApiDto {
    const prams = {} as LegalNoticeDeleteApiDto;
    if (dto.uniqId) {
        prams.uniq_id = dto.uniqId;
    }
    return prams;
}
