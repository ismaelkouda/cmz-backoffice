import { DepartmentsDeleteDto } from '@pages/administrative-boundary/application/dto/departments/departments-delete.dto';
import { DepartmentsDeleteApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/departments/departments-delete-api.dto';

export function departmentsDeleteMapper(
    dto: DepartmentsDeleteDto
): DepartmentsDeleteApiDto {
    const prams = {} as DepartmentsDeleteApiDto;
    if (dto.uniqId) {
        prams.uniq_id = dto.uniqId;
    }
    return prams;
}
