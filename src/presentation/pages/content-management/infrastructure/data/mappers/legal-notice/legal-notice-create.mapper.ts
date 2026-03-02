import { LegalNoticeCreateEntity } from '@presentation/pages/content-management/domain/entities/legal-notice/legal-notice-create.entity';
import { LegalNoticeCreateApiDto } from '@presentation/pages/content-management/infrastructure/api/dto/legal-notice/legal-notice-create-api.dto';

export function legalNoticeCreateMapper(
    entity: LegalNoticeCreateEntity
): LegalNoticeCreateApiDto {
    const params: LegalNoticeCreateApiDto = {} as LegalNoticeCreateApiDto;

    if (entity.version) {
        params.version = entity.version;
    }
    if (entity.content) {
        params.content = entity.content;
    }

    return params;
}
