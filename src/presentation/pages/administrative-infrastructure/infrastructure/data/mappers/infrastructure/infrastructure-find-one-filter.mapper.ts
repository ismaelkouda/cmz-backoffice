import { InfrastructureFindOneFilterEntity } from '@pages/administrative-infrastructure/domain/entities/infrastructure/infrastructure-find-one-filter.entity';
import { InfrastructureFindOneFilterApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure/infrastructure-find-one-filter-api.dto';

export function infrastructureFindOneFilterMapper(
    entity: InfrastructureFindOneFilterEntity
): InfrastructureFindOneFilterApiDto {
    const params: InfrastructureFindOneFilterApiDto =
        {} as InfrastructureFindOneFilterApiDto;

    if (entity.uniqId) {
        params.id = entity.uniqId;
    }

    return params;
}
