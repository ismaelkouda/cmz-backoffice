import { InfrastructureTypeFilterEntity } from '@pages/administrative-infrastructure/domain/entities/infrastructure-type/infrastructure-type-filter.entity';
import { InfrastructureTypeFilterApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure-type/infrastructure-type-filter-api.dto';

export function infrastructureTypeFilterMapper(
    entity: InfrastructureTypeFilterEntity
): InfrastructureTypeFilterApiDto {
    const params: InfrastructureTypeFilterApiDto =
        {} as InfrastructureTypeFilterApiDto;

    if (entity.search) {
        params.search = entity.search;
    }
    if (entity.isActive !== undefined) {
        params.is_active = !!entity.isActive;
    }

    return params;
}
