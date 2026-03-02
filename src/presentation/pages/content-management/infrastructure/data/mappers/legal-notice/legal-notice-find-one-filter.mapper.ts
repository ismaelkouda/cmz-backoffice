import { LegalNoticeFindOneFilterEntity } from '@presentation/pages/content-management/domain/entities/legal-notice/legal-notice-find-one-filter.entity';
import { LegalNoticeFindOneFilterApiDto } from '@presentation/pages/content-management/infrastructure/api/dto/legal-notice/legal-notice-find-one-filter-api.dto';

export function legalNoticeFindOneFilterMapper(
    entity: LegalNoticeFindOneFilterEntity
): LegalNoticeFindOneFilterApiDto {
    const params: LegalNoticeFindOneFilterApiDto =
        {} as LegalNoticeFindOneFilterApiDto;

    if (entity.uniqId) {
        params.id = entity.uniqId;
    }

    return params;
}
