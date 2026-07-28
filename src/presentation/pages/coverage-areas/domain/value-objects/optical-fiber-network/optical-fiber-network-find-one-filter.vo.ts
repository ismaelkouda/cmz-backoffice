import { OpticalFiberNetworkFindOneFilterContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-find-one-filter.contract';
import { OpticalFiberNetworkFindOneFilterValidateContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-find-one-filter.validate-contract';
import { validateOpticalFiberNetworkFindOneFilter } from '@pages/coverage-areas/domain/validators/optical-fiber-network/optical-fiber-network-find-one-filter.validator';

export function opticalFiberNetworkFindOneFilterVo(
    contract: OpticalFiberNetworkFindOneFilterContract
): OpticalFiberNetworkFindOneFilterValidateContract {
    validateOpticalFiberNetworkFindOneFilter(contract);
    return {
        uniqId: contract.uniqId,
    };
}
