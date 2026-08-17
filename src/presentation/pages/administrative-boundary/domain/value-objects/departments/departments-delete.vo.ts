import { DepartmentsDeleteDto } from '@pages/administrative-boundary/application/dto/departments/departments-delete.dto';

export function departmentsDeleteVo(
    dto: DepartmentsDeleteDto
): DepartmentsDeleteDto {
    return {
        uniqId: dto.uniqId,
    };
}
