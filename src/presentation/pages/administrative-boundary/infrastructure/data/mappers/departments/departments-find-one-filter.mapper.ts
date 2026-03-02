import { DepartmentsFindOneFilterEntity } from '@presentation/pages/administrative-boundary/domain/entities/departments/departments-find-one-filter.entity';
import { DepartmentsFindOneFilterApiDto } from '@presentation/pages/administrative-boundary/infrastructure/api/dto/departments/departments-find-one-filter-api.dto';

export function departmentsFindOneFilterMapper(
    entity: DepartmentsFindOneFilterEntity
): DepartmentsFindOneFilterApiDto {
    const params: DepartmentsFindOneFilterApiDto =
        {} as DepartmentsFindOneFilterApiDto;

    if (entity.uniqId) {
        params.uniq_id = entity.uniqId;
    }

    return params;
}
