import { OpticalFiberNetworkUpdateValidateContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-update.validate-contract';
import { OpticalFiberNetworkUpdateApiDto } from '@pages/coverage-areas/infrastructure/api/dto/optical-fiber-network/optical-fiber-network-update-api.dto';

export function opticalFiberNetworkUpdateMapper(
    validContract: OpticalFiberNetworkUpdateValidateContract
): OpticalFiberNetworkUpdateApiDto {
    const params: OpticalFiberNetworkUpdateApiDto = {
        id: validContract.uniqId,
        name: validContract.name,
        operator: validContract.operator,
        fiber_constructor_id: validContract.fiberConstructorId,
        type: validContract.type,
    };
    if (validContract.geomFile) {
        params.geom_file = validContract.geomFile;
    }
    return params;
}
