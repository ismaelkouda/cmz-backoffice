import { DepartmentsCreateEntity } from '@pages/administrative-boundary/domain/entities/departments/departments-create.entity';
import { DepartmentsCreateApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/departments/departments-create-api.dto';

export function departmentsCreateMapper(
    create: DepartmentsCreateEntity
): DepartmentsCreateApiDto {
    const params: DepartmentsCreateApiDto = {} as DepartmentsCreateApiDto;

    if (create.code) {
        params['code'] = create.code;
    }
    if (create.name) {
        params['name'] = create.name;
    }
    if (create.region) {
        params['region_code'] = create.region;
    }
    if (create.description) {
        params['description'] = create.description;
    }

    return params;
}
