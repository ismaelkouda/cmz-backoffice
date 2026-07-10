import { InfrastructureTypeUpdateEntity } from '@pages/administrative-infrastructure/domain/entities/infrastructure-type/infrastructure-type-update.entity';
import { InfrastructureTypeUpdateApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure-type/infrastructure-type-update-api.dto';

export function infrastructureTypeUpdateMapper(
    entity: InfrastructureTypeUpdateEntity
): InfrastructureTypeUpdateApiDto {
    const params: InfrastructureTypeUpdateApiDto =
        {} as InfrastructureTypeUpdateApiDto;

    if (entity.uniqId) {
        params.id = entity.uniqId;
    }
    if (entity.name) {
        params.name = entity.name;
    }
    if (entity.description) {
        params.description = entity.description;
    }

    return params;
}
