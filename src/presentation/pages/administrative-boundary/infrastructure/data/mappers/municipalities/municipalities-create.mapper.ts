import { MunicipalitiesCreateValidateContract } from '@presentation/pages/administrative-boundary/domain/contracts/municipalities/municipalities-create.validate-contract';
import { MunicipalitiesCreateApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/municipalities/municipalities-create-api.dto';

export function municipalitiesCreateMapper(
    create: MunicipalitiesCreateValidateContract
): MunicipalitiesCreateApiDto {
    const params: MunicipalitiesCreateApiDto = {} as MunicipalitiesCreateApiDto;

    params['code'] = create.code;
    params['population_size'] = create.population;
    params['infrastructure_size'] = create.infrastructure;
    params['name'] = create.name;
    params['region_code'] = create.region;
    params['department_code'] = create.department;
    if (create.description) {
        params['description'] = create.description;
    }

    return params;
}
