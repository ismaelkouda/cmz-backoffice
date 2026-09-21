import { InfrastructureTypeFilterApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure-type/infrastructure-type-filter-api.dto';
import { InfrastructureTypeFilterContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure-type/infrastructure-type-filter.contract';
import { toApiDateOnly } from '@shared/domain/utils/api-date.util';

export function infrastructureTypeFilterMapper(
    validContract: InfrastructureTypeFilterContract
): InfrastructureTypeFilterApiDto {
    const params: InfrastructureTypeFilterApiDto =
        {} as InfrastructureTypeFilterApiDto;

    if (validContract.search) {
        params.search = validContract.search;
    }
    if (validContract.status !== undefined) {
        params.is_active = !!validContract.status;
    }

    if (validContract.tag) {
        params.tag = validContract.tag;
    }
    if (validContract.startDate) {
        params.start_date = toApiDateOnly(validContract.startDate);
    }
    if (validContract.endDate) {
        params.end_date = toApiDateOnly(validContract.endDate);
    }

    return params;
}
