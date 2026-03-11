import { DepartmentsDeleteEntity } from '@pages/administrative-boundary/domain/entities/departments/departments-delete.entity';
import { DepartmentsDeleteApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/departments/departments-delete-api.dto';

export function departmentsDeleteMapper(
    vo: DepartmentsDeleteEntity
): DepartmentsDeleteApiDto {
    const prams = {} as DepartmentsDeleteApiDto;
    if (vo.uniqId) {
        prams.uniq_id = vo.uniqId;
    }
    return prams;
}
