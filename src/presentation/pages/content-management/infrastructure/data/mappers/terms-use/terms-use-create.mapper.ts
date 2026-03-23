import { TermsUseCreateEntity } from '@pages/content-management/domain/entities/terms-use/terms-use-create.entity';
import { TermsUseCreateApiDto } from '@pages/content-management/infrastructure/api/dto/terms-use/terms-use-create-api.dto';

export function termsUseCreateMapper(
    entity: TermsUseCreateEntity
): TermsUseCreateApiDto {
    const params: TermsUseCreateApiDto = {} as TermsUseCreateApiDto;

    if (entity.version) {
        params.version = entity.version;
    }
    if (entity.content) {
        params.content = entity.content;
    }

    return params;
}
