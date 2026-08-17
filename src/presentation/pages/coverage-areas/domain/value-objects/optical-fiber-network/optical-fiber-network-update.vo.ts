import { OpticalFiberNetworkUpdateContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-update.contract';
import { OpticalFiberNetworkUpdateValidateContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-update.validate-contract';
import { validateOpticalFiberNetworkUpdate } from '@pages/coverage-areas/domain/validators/optical-fiber-network/optical-fiber-network-update.validator';

export function opticalFiberNetworkUpdateVo(
    contract: OpticalFiberNetworkUpdateContract
): OpticalFiberNetworkUpdateValidateContract {
    validateOpticalFiberNetworkUpdate(contract);
    return {
        uniqId: contract.uniqId,
        name: contract.name,
        operator: contract.operator,
        fiberConstructorId: contract.fiberConstructorId,
        type: contract.type,
        geomFile: contract.geomFile,
    };
}
