import { InfrastructureFilterApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure/infrastructure-filter-api.dto';
import { InfrastructureFilterContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure/infrastructure-filter.contract';
import { toApiDateOnly } from '@shared/domain/utils/api-date.util';

export function infrastructureFilterMapper(
    validContract: InfrastructureFilterContract
): InfrastructureFilterApiDto {
    const params: InfrastructureFilterApiDto = {} as InfrastructureFilterApiDto;

    if (validContract.search) {
        params.search = validContract.search;
    }
    if (validContract.type) {
        params.type = validContract.type;
    }
    if (validContract.region) {
        params.region_id = validContract.region;
    }
    if (validContract.department) {
        params.department_id = validContract.department;
    }
    if (validContract.municipality) {
        params.municipality_id = validContract.municipality;
    }
    if (validContract.startDate) {
        params.start_date = toApiDateOnly(validContract.startDate);
    }
    if (validContract.endDate) {
        params.end_date = toApiDateOnly(validContract.endDate);
    }

    return params;
}
