import { InfrastructureUpdateEntity } from '@pages/administrative-infrastructure/domain/entities/infrastructure/infrastructure-update.entity';
import { InfrastructureUpdateApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure/infrastructure-update-api.dto';

export function infrastructureUpdateMapper(
    entity: InfrastructureUpdateEntity
): InfrastructureUpdateApiDto {
    const params: InfrastructureUpdateApiDto = {} as InfrastructureUpdateApiDto;

    if (entity.data.uniqId) {
        params.id = entity.data.uniqId;
    }
    if (entity.data.name) {
        params.name = entity.data.name;
    }
    if (entity.data.type) {
        params.infrastructure_type = entity.data.type;
    }
    if (entity.data.position) {
        params.latitude = entity.data.position.latitude;
        params.longitude = entity.data.position.longitude;
    }
    if (entity.data.description) {
        params.description = entity.data.description;
    }

    return params;
}
