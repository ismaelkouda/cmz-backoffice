import { DepartmentsByRegionIdFilterDto } from '@pages/administrative-boundary/application/dto/regions/departments-by-region-id-filter.dto';
import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';

export function validateDepartmentsByRegionIdFilter(
    dto: DepartmentsByRegionIdFilterDto
): asserts dto is DepartmentsByRegionIdFilterDto & { uniqId: string } {
    if (!dto.uniqId) {
        throw new GenericRequiredError(
            'ADMINISTRATIVE_BOUNDARY.REGIONS.FORM.ERROR.DEPARTMENTS_BY_REGION_ID.UNIQ_ID_REQUIRE'
        );
    }
}
