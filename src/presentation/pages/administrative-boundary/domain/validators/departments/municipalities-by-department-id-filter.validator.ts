import { MunicipalitiesByDepartmentIdFilterDto } from '@pages/administrative-boundary/application/dto/departments/municipalities-by-department-id-filter.dto';
import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';

export function validateMunicipalitiesByDepartmentIdFilter(
    dto: MunicipalitiesByDepartmentIdFilterDto
): asserts dto is MunicipalitiesByDepartmentIdFilterDto & { uniqId: string } {
    if (!dto.uniqId) {
        throw new GenericRequiredError(
            'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.FORM.ERROR.MUNICIPALITIES_BY_DEPARTMENT_ID.UNIQ_ID_REQUIRE'
        );
    }
}
