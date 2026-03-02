import { DepartmentsUpdateEntity } from '@presentation/pages/administrative-boundary/domain/entities/departments/departments-update.entity';
import { DepartmentsUpdateApiDto } from '@presentation/pages/administrative-boundary/infrastructure/api/dto/departments/departments-update-api.dto';

export function departmentsUpdateMapper(
    update: DepartmentsUpdateEntity
): DepartmentsUpdateApiDto {
    const params: DepartmentsUpdateApiDto = {} as DepartmentsUpdateApiDto;

    params.id = update.uniqId;
    if (update.code) {
        params['code'] = update.code;
    }
    if (update.name) {
        params['name'] = update.name;
    }
    if (update.region) {
        params['region_code'] = update.region;
    }
    if (update.description) {
        params['description'] = update.description;
    }

    return params;
}
