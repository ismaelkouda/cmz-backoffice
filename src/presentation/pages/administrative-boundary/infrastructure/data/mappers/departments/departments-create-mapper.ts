import { DepartmentsCreate } from '@presentation/pages/administrative-boundary/core/domain/value-objects/departments/departments-create.vo';
import { DepartmentsCreateApiDto } from '@presentation/pages/administrative-boundary/infrastructure/api/dtos/departments/departments-create-api.dto';

export function departmentsCreateMapper(
    create: DepartmentsCreate
): DepartmentsCreateApiDto {
    const params: DepartmentsCreateApiDto = {} as DepartmentsCreateApiDto;

    if (create.code) {
        params['code'] = create.code;
    }
    if (create.name) {
        params['name'] = create.name;
    }
    if (create. regionId) {
        params['region_code'] = create. regionId;
    }
    if (create.description) {
        params['description'] = create.description;
    }

    return params;
}
