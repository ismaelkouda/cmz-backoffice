import { TermsUseCreateEntity } from '@presentation/pages/content-management/domain/entities/terms-use/terms-use-create.entity';
import { TermsUseCreateApiDto } from '@presentation/pages/content-management/infrastructure/api/dto/terms-use/terms-use-create-api.dto';

export function termsUseCreateMapper(
    entity: TermsUseCreateEntity
): TermsUseCreateApiDto {
    const params: TermsUseCreateApiDto = {} as TermsUseCreateApiDto;

    if (entity.version) {
        params.first_name = entity.version;
    }
    if (entity.content) {
        params.last_name = entity.content;
    }

    return params;
}
