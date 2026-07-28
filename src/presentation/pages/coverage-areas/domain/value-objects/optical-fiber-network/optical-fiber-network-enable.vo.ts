import { OpticalFiberNetworkEnableContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-enable.contract';
import { OpticalFiberNetworkEnableValidateContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-enable.validate-contract';
import { validateOpticalFiberNetworkEnable } from '@pages/coverage-areas/domain/validators/optical-fiber-network/optical-fiber-network-enable.validator';

export function opticalFiberNetworkEnableVo(
    contract: OpticalFiberNetworkEnableContract
): OpticalFiberNetworkEnableValidateContract {
    validateOpticalFiberNetworkEnable(contract);
    return {
        uniqId: contract.uniqId,
    };
}
