import { MunicipalitiesCreate } from '@presentation/pages/administrative-boundary/core/domain/value-objects/municipalities/municipalities-create.vo';
import { MunicipalitiesCreateApiDto } from '@presentation/pages/administrative-boundary/infrastructure/api/dtos/municipalities/municipalities-create-api.dto';

export function municipalitiesCreateMapper(
    create: MunicipalitiesCreate
): MunicipalitiesCreateApiDto {
    const params: MunicipalitiesCreateApiDto = {} as MunicipalitiesCreateApiDto;

    if (create.code) {
        params['code'] = create.code;
    }
    if (create.name) {
        params['name'] = create.name;
    }
    if (create.departmentId) {
        params['department_code'] = create.departmentId;
    }
    if (create.description) {
        params['description'] = create.description;
    }

    return params;
}
