import { TermsUseFilterEntity } from '@pages/content-management/domain/entities/terms-use/terms-use-filter.entity';
import { Status } from '@pages/content-management/domain/enums/terms-use/terms-use-status.enum';
import { TermsUseFilterApiDto } from '@pages/content-management/infrastructure/api/dto/terms-use/terms-use-filter-api.dto';

export function termsUseFilterMapper(
    entity: TermsUseFilterEntity
): TermsUseFilterApiDto {
    const params: TermsUseFilterApiDto = {} as TermsUseFilterApiDto;

    if (entity.search) {
        params.search = entity.search;
    }
    if (entity.version) {
        params.version = entity.version;
    }
    if (entity.status) {
        params.is_published = entity.status === Status.PUBLISH;
    }
    if (entity.startDate) {
        params.start_date = entity.startDate;
    }
    if (entity.endDate) {
        params.end_date = entity.endDate;
    }

    return params;
}
