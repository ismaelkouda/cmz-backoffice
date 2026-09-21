import { MunicipalitiesUpdateValidateContract } from '@presentation/pages/administrative-boundary/domain/contracts/municipalities/municipalities-update.validate-contract';
import { MunicipalitiesUpdateApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/municipalities/municipalities-update-api.dto';

export function municipalitiesUpdateMapper(
    update: MunicipalitiesUpdateValidateContract
): MunicipalitiesUpdateApiDto {
    const params: MunicipalitiesUpdateApiDto = {} as MunicipalitiesUpdateApiDto;

    params.id = update.uniqId;
    params['code'] = update.code;
    params['population_size'] = update.population;
    params['infrastructure_size'] = update.infrastructure;
    params['name'] = update.name;
    params['region_code'] = update.region;
    params['department_code'] = update.department;
    if (update.description) {
        params['description'] = update.description;
    }

    return params;
}
