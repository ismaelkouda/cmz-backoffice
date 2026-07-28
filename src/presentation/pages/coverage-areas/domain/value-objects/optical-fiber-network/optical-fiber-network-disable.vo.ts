import { OpticalFiberNetworkDisableContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-disable.contract';
import { OpticalFiberNetworkDisableValidateContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-disable.validate-contract';
import { validateOpticalFiberNetworkDisable } from '@pages/coverage-areas/domain/validators/optical-fiber-network/optical-fiber-network-disable.validator';

export function opticalFiberNetworkDisableVo(
    contract: OpticalFiberNetworkDisableContract
): OpticalFiberNetworkDisableValidateContract {
    validateOpticalFiberNetworkDisable(contract);
    return {
        uniqId: contract.uniqId,
    };
}
