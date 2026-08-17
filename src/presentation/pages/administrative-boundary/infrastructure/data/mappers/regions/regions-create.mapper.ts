import { RegionsCreateValidateContract } from '@presentation/pages/administrative-boundary/domain/contracts/regions/regions-create.validate-contract';
import { RegionsCreateApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/regions/regions-create-api.dto';

export function regionsCreateMapper(
    create: RegionsCreateValidateContract
): RegionsCreateApiDto {
    const params: RegionsCreateApiDto = {} as RegionsCreateApiDto;

    params['code'] = create.code;
    params['population_size'] = create.population;
    params['infrastructure_size'] = create.infrastructure;
    params['name'] = create.name;
    if (create.description) {
        params['description'] = create.description;
    }

    return params;
}
