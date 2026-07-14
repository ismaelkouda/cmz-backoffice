import { InfrastructureFilterApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure/infrastructure-filter-api.dto';
import { InfrastructureFilterContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure/infrastructure-filter.contract';

export function infrastructureFilterMapper(
    contract: InfrastructureFilterContract
): InfrastructureFilterApiDto {
    const params: InfrastructureFilterApiDto = {} as InfrastructureFilterApiDto;

    if (contract.search) {
        params.search = contract.search;
    }
    if (contract.type) {
        params.type = contract.type;
    }
    if (contract.region) {
        params.region_id = contract.region;
    }
    if (contract.department) {
        params.department_id = contract.department;
    }
    if (contract.municipality) {
        params.municipality_id = contract.municipality;
    }
    if (contract.startDate) {
        params.start_date = contract.startDate;
    }
    if (contract.endDate) {
        params.end_date = contract.endDate;
    }

    return params;
}
