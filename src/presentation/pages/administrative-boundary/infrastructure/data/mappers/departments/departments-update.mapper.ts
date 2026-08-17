import { DepartmentsUpdateValidateContract } from '@presentation/pages/administrative-boundary/domain/contracts/departments/departments-update.validate-contract';
import { DepartmentsUpdateApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/departments/departments-update-api.dto';

export function departmentsUpdateMapper(
    update: DepartmentsUpdateValidateContract
): DepartmentsUpdateApiDto {
    const params: DepartmentsUpdateApiDto = {} as DepartmentsUpdateApiDto;

    params.id = update.uniqId;
    params['code'] = update.code;
    params['population_size'] = update.population;
    params['infrastructure_size'] = update.infrastructure;
    params['name'] = update.name;
    params['region_id'] = update.region;
    if (update.description) {
        params['description'] = update.description;
    }

    return params;
}
