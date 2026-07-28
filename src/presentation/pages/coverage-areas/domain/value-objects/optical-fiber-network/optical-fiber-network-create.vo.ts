import { OpticalFiberNetworkCreateContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-create.contract';
import { OpticalFiberNetworkCreateValidateContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-create.validate-contract';
import { validateOpticalFiberNetworkCreate } from '@pages/coverage-areas/domain/validators/optical-fiber-network/optical-fiber-network-create.validator';

export function opticalFiberNetworkCreateVo(
    contract: OpticalFiberNetworkCreateContract
): OpticalFiberNetworkCreateValidateContract {
    validateOpticalFiberNetworkCreate(contract);
    return {
        name: contract.name,
        operator: contract.operator,
        fiberConstructorId: contract.fiberConstructorId,
        type: contract.type,
        geomFile: contract.geomFile,
    };
}
