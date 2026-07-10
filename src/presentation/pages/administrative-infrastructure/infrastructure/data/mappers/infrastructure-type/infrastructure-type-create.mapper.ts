import { InfrastructureTypeCreateEntity } from '@pages/administrative-infrastructure/domain/entities/infrastructure-type/infrastructure-type-create.entity';
import { InfrastructureTypeCreateApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure-type/infrastructure-type-create-api.dto';

export function infrastructureTypeCreateMapper(
    entity: InfrastructureTypeCreateEntity
): InfrastructureTypeCreateApiDto {
    const params: InfrastructureTypeCreateApiDto =
        {} as InfrastructureTypeCreateApiDto;

    if (entity.name) {
        params.name = entity.name;
    }
    if (entity.description) {
        params.description = entity.description;
    }

    return params;
}
