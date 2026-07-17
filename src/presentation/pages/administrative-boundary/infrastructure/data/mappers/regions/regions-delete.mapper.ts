import { RegionsDeleteDto } from '@pages/administrative-boundary/application/dto/regions/regions-delete.dto';
import { RegionsDeleteApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/regions/regions-delete-api.dto';

export function regionsDeleteMapper(
    dto: RegionsDeleteDto
): RegionsDeleteApiDto {
    const prams = {} as RegionsDeleteApiDto;
    if (dto.uniqId) {
        prams.uniq_id = dto.uniqId;
    }
    return prams;
}
