import { LegalNoticeDeleteEntity } from '@presentation/pages/content-management/domain/entities/legal-notice/legal-notice-delete.entity';
import { LegalNoticeDeleteApiDto } from '@presentation/pages/content-management/infrastructure/api/dto/legal-notice/legal-notice-delete-api.dto';

export function legalNoticeDeleteMapper(
    vo: LegalNoticeDeleteEntity
): LegalNoticeDeleteApiDto {
    const prams = {} as LegalNoticeDeleteApiDto;
    if (vo.uniqId) {
        prams.uniq_id = vo.uniqId;
    }
    return prams;
}
