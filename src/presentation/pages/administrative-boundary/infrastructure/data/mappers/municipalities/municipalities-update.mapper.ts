import { MunicipalitiesUpdateEntity } from '@pages/administrative-boundary/domain/entities/municipalities/municipalities-update.entity';
import { MunicipalitiesUpdateApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/municipalities/municipalities-update-api.dto';

export function municipalitiesUpdateMapper(
    update: MunicipalitiesUpdateEntity
): MunicipalitiesUpdateApiDto {
    const params: MunicipalitiesUpdateApiDto = {} as MunicipalitiesUpdateApiDto;

    params.id = update.uniqId;
    if (update.code) {
        params['code'] = update.code;
    }
    if (update.population) {
        params['population_size'] = update.population;
    }
    if (update.infrastructure) {
        params['infrastructure_size'] = update.infrastructure;
    }
    if (update.name) {
        params['name'] = update.name;
    }
    if (update.region) {
        params['region_id'] = update.region;
    }
    if (update.description) {
        params['description'] = update.description;
    }
    if (update.department) {
        params['department_id'] = update.department;
    }

    return params;
}
