import { MunicipalitiesUpdate } from '@presentation/pages/administrative-boundary/core/domain/value-objects/municipalities/municipalities-update.vo';
import { MunicipalitiesUpdateApiDto } from '@presentation/pages/administrative-boundary/infrastructure/api/dtos/municipalities/municipalities-update-api.dto';

export function municipalitiesUpdateMapper(
    update: MunicipalitiesUpdate
): MunicipalitiesUpdateApiDto {
    const params: MunicipalitiesUpdateApiDto = {} as MunicipalitiesUpdateApiDto;

    params.id = update.id;
    if (update.code) {
        params['code'] = update.code;
    }
    if (update.name) {
        params['name'] = update.name;
    }
    if (update.departmentId) {
        params['department_code'] = update.departmentId;
    }
    if (update.description) {
        params['description'] = update.description;
    }

    return params;
}
