import { InfrastructureTypeFindOneFilterEntity } from '@pages/administrative-infrastructure/domain/entities/infrastructure-type/infrastructure-type-find-one-filter.entity';
import { InfrastructureTypeFindOneFilterApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure-type/infrastructure-type-find-one-filter-api.dto';

export function infrastructureTypeFindOneFilterMapper(
    entity: InfrastructureTypeFindOneFilterEntity
): InfrastructureTypeFindOneFilterApiDto {
    const params: InfrastructureTypeFindOneFilterApiDto =
        {} as InfrastructureTypeFindOneFilterApiDto;

    if (entity.uniqId) {
        params.id = entity.uniqId;
    }

    return params;
}
