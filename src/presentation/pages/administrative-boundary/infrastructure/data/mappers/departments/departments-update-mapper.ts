import { DepartmentsUpdate } from '@presentation/pages/administrative-boundary/core/domain/value-objects/departments/departments-update.vo';
import { DepartmentsUpdateApiDto } from '@presentation/pages/administrative-boundary/infrastructure/api/dtos/departments/departments-update-api.dto';

export function departmentsUpdateMapper(
    update: DepartmentsUpdate
): DepartmentsUpdateApiDto {
    const params: DepartmentsUpdateApiDto = {} as DepartmentsUpdateApiDto;

    params.id = update.id;
    if (update.code) {
        params['code'] = update.code;
    }
    if (update.name) {
        params['name'] = update.name;
    }
    if (update.regionId) {
        params['region_code'] = update.regionId;
    }
    if (update.description) {
        params['description'] = update.description;
    }

    return params;
}
