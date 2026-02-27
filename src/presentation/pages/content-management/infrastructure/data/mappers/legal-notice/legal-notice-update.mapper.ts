import { LegalNoticeUpdateEntity } from '@presentation/pages/content-management/domain/entities/legal-notice/legal-notice-update.entity';
import { LegalNoticeUpdateApiDto } from '@presentation/pages/content-management/infrastructure/api/dto/legal-notice/legal-notice-update-api.dto';

export function legalNoticeUpdateMapper(
    entity: LegalNoticeUpdateEntity
): LegalNoticeUpdateApiDto {
    const params: LegalNoticeUpdateApiDto = {} as LegalNoticeUpdateApiDto;

    if (entity.uniqId) {
        params.id = entity.uniqId;
    }
    if (entity.version) {
        params.version = entity.version;
    }
    if (entity.content) {
        params.content = entity.content;
    }

    return params;
}
