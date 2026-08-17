import { RegionsUpdateValidateContract } from '@presentation/pages/administrative-boundary/domain/contracts/regions/regions-update.validate-contract';
import { RegionsUpdateApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/regions/regions-update-api.dto';

export function regionsUpdateMapper(
    update: RegionsUpdateValidateContract
): RegionsUpdateApiDto {
    const params: RegionsUpdateApiDto = {} as RegionsUpdateApiDto;

    params.id = update.uniqId;
    params['code'] = update.code;
    params['population_size'] = update.population;
    params['infrastructure_size'] = update.infrastructure;
    params['name'] = update.name;
    if (update.description) {
        params['description'] = update.description;
    }

    return params;
}
