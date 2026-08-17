import { TermsUseFindOneFilterEntity } from '@pages/content-management/domain/entities/terms-use/terms-use-find-one-filter.entity';
import { TermsUseFindOneFilterApiDto } from '@pages/content-management/infrastructure/api/dto/terms-use/terms-use-find-one-filter-api.dto';

export function termsUseFindOneFilterMapper(
    entity: TermsUseFindOneFilterEntity
): TermsUseFindOneFilterApiDto {
    const params: TermsUseFindOneFilterApiDto =
        {} as TermsUseFindOneFilterApiDto;

    if (entity.uniqId) {
        params.id = entity.uniqId;
    }

    return params;
}
