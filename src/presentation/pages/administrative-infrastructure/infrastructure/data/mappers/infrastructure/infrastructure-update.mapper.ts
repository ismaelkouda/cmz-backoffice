import { InfrastructureUpdateEntity } from '@pages/administrative-infrastructure/domain/entities/infrastructure/infrastructure-update.entity';
import { InfrastructureUpdateApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure/infrastructure-update-api.dto';

export function infrastructureUpdateMapper(
    entity: InfrastructureUpdateEntity
): InfrastructureUpdateApiDto {
    const params: InfrastructureUpdateApiDto = {} as InfrastructureUpdateApiDto;

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
