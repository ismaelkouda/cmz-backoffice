import { RegionsCreateEntity } from '@pages/administrative-boundary/domain/entities/regions/regions-create.entity';
import { RegionsCreateApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/regions/regions-create-api.dto';

export function regionsCreateMapper(
    create: RegionsCreateEntity
): RegionsCreateApiDto {
    const params: RegionsCreateApiDto = {} as RegionsCreateApiDto;

    if (create.code) {
        params['code'] = create.code;
    }
    if (create.population) {
        params['population_size'] = create.population;
    }
    if (create.infrastructure) {
        params['infrastructure_size'] = create.infrastructure;
    }
    if (create.name) {
        params['name'] = create.name;
    }
    if (create.description) {
        params['description'] = create.description;
    }

    return params;
}
