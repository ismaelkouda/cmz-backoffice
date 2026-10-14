import { RequestFilterContract } from '@pages/report-states/domain/contracts/request/request-filter.contract';
import { validateRequestFilter } from '@pages/report-states/domain/validators/request/request-filter.validator';

export function requestFilterVo(
    contract: RequestFilterContract
): RequestFilterContract {
    validateRequestFilter(contract);
    return contract;
}
