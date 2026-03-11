import { RegionsUpdateEntity } from '@pages/administrative-boundary/domain/entities/regions/regions-update.entity';
import { RegionsUpdateApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/regions/regions-update-api.dto';

export function regionsUpdateMapper(
    update: RegionsUpdateEntity
): RegionsUpdateApiDto {
    const params: RegionsUpdateApiDto = {} as RegionsUpdateApiDto;

    params.id = update.uniqId;
    if (update.code) {
        params['code'] = update.code;
    }
    if (update.name) {
        params['name'] = update.name;
    }
    if (update.description) {
        params['description'] = update.description;
    }

    return params;
}
