import { MunicipalitiesUpdateEntity } from '@presentation/pages/administrative-boundary/domain/entities/municipalities/municipalities-update.entity';
import { MunicipalitiesUpdateApiDto } from '@presentation/pages/administrative-boundary/infrastructure/api/dto/municipalities/municipalities-update-api.dto';

export function municipalitiesUpdateMapper(
    update: MunicipalitiesUpdateEntity
): MunicipalitiesUpdateApiDto {
    const params: MunicipalitiesUpdateApiDto = {} as MunicipalitiesUpdateApiDto;

    params.id = update.uniqId;
    if (update.code) {
        params['code'] = update.code;
    }
    if (update.name) {
        params['name'] = update.name;
    }
    if (update.department) {
        params['department_code'] = update.department;
    }
    if (update.description) {
        params['description'] = update.description;
    }

    return params;
}
