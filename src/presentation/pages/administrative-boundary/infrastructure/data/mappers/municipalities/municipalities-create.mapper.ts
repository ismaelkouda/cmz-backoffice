import { MunicipalitiesCreateEntity } from '@pages/administrative-boundary/domain/entities/municipalities/municipalities-create.entity';
import { MunicipalitiesCreateApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/municipalities/municipalities-create-api.dto';

export function municipalitiesCreateMapper(
    create: MunicipalitiesCreateEntity
): MunicipalitiesCreateApiDto {
    const params: MunicipalitiesCreateApiDto = {} as MunicipalitiesCreateApiDto;

    if (create.code) {
        params['code'] = create.code;
    }
    if (create.name) {
        params['name'] = create.name;
    }
    if (create.department) {
        params['department_code'] = create.department;
    }
    if (create.description) {
        params['description'] = create.description;
    }

    return params;
}
