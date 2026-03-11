import { TermsUseUpdateEntity } from '@pages/content-management/domain/entities/terms-use/terms-use-update.entity';
import { TermsUseUpdateApiDto } from '@pages/content-management/infrastructure/api/dto/terms-use/terms-use-update-api.dto';

export function termsUseUpdateMapper(
    entity: TermsUseUpdateEntity
): TermsUseUpdateApiDto {
    const params: TermsUseUpdateApiDto = {} as TermsUseUpdateApiDto;

    if (entity.uniqId) {
        params.id = entity.uniqId;
    }
    if (entity.version) {
        params.first_name = entity.version;
    }
    if (entity.content) {
        params.last_name = entity.content;
    }

    return params;
}
