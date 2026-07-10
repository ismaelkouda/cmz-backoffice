import { InfrastructureDeleteEntity } from '@pages/administrative-infrastructure/domain/entities/infrastructure/infrastructure-delete.entity';
import { InfrastructureDeleteApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure/infrastructure-delete-api.dto';

export function infrastructureDeleteMapper(
    vo: InfrastructureDeleteEntity
): InfrastructureDeleteApiDto {
    const prams = {} as InfrastructureDeleteApiDto;
    if (vo.uniqId) {
        prams.uniq_id = vo.uniqId;
    }
    return prams;
}
