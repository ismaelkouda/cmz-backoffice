import { OpticalFiberNetworkDeleteContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-delete.contract';
import { OpticalFiberNetworkDeleteValidateContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-delete.validate-contract';
import { validateOpticalFiberNetworkDelete } from '@pages/coverage-areas/domain/validators/optical-fiber-network/optical-fiber-network-delete.validator';

export function opticalFiberNetworkDeleteVo(
    contract: OpticalFiberNetworkDeleteContract
): OpticalFiberNetworkDeleteValidateContract {
    validateOpticalFiberNetworkDelete(contract);
    return {
        uniqId: contract.uniqId,
    };
}
