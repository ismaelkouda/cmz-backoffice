import { RegionsDeleteEntity } from '@presentation/pages/administrative-boundary/domain/entities/regions/regions-delete.entity';
import { RegionsDeleteApiDto } from '@presentation/pages/administrative-boundary/infrastructure/api/dto/regions/regions-delete-api.dto';

export function regionsDeleteMapper(
    vo: RegionsDeleteEntity
): RegionsDeleteApiDto {
    const prams = {} as RegionsDeleteApiDto;
    if (vo.uniqId) {
        prams.uniq_id = vo.uniqId;
    }
    return prams;
}
