import { DepartmentsCreateValidateContract } from '@presentation/pages/administrative-boundary/domain/contracts/departments/departments-create.validate-contract';
import { DepartmentsCreateApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/departments/departments-create-api.dto';

export function departmentsCreateMapper(
    create: DepartmentsCreateValidateContract
): DepartmentsCreateApiDto {
    const params: DepartmentsCreateApiDto = {} as DepartmentsCreateApiDto;

    params['code'] = create.code;
    params['population_size'] = create.population;
    params['infrastructure_size'] = create.infrastructure;
    params['name'] = create.name;
    params['region_code'] = create.region;
    if (create.description) {
        params['description'] = create.description;
    }

    return params;
}
