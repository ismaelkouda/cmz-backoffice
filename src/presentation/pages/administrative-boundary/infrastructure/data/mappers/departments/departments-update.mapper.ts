import { DepartmentsUpdateEntity } from '@pages/administrative-boundary/domain/entities/departments/departments-update.entity';
import { DepartmentsUpdateApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/departments/departments-update-api.dto';

export function departmentsUpdateMapper(
    update: DepartmentsUpdateEntity
): DepartmentsUpdateApiDto {
    const params: DepartmentsUpdateApiDto = {} as DepartmentsUpdateApiDto;

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

    return params;
}
