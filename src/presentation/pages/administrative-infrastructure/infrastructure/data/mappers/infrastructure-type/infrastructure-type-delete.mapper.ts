import { InfrastructureTypeDeleteEntity } from '@pages/administrative-infrastructure/domain/entities/infrastructure-type/infrastructure-type-delete.entity';
import { InfrastructureTypeDeleteApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure-type/infrastructure-type-delete-api.dto';

export function infrastructureTypeDeleteMapper(
    vo: InfrastructureTypeDeleteEntity
): InfrastructureTypeDeleteApiDto {
    const prams = {} as InfrastructureTypeDeleteApiDto;
    if (vo.uniqId) {
        prams.uniq_id = vo.uniqId;
    }
    return prams;
}
