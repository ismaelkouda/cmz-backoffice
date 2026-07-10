import { InfrastructureFilterEntity } from '@pages/administrative-infrastructure/domain/entities/infrastructure/infrastructure-filter.entity';
import { InfrastructureFilterApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure/infrastructure-filter-api.dto';

export function infrastructureFilterMapper(
    entity: InfrastructureFilterEntity
): InfrastructureFilterApiDto {
    const params: InfrastructureFilterApiDto = {} as InfrastructureFilterApiDto;

    if (entity.search) {
        params.search = entity.search;
    }
    if (entity.type) {
        params.type = entity.type;
    }
    if (entity.region) {
        params.region_id = entity.region;
    }
    if (entity.department) {
        params.department_id = entity.department;
    }
    if (entity.municipality) {
        params.municipality_id = entity.municipality;
    }
    if (entity.position) {
        params.position = entity.position;
    }

    return params;
}
