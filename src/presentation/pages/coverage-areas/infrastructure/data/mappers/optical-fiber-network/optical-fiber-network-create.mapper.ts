import { OpticalFiberNetworkCreateValidateContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-create.validate-contract';
import { OpticalFiberNetworkCreateApiDto } from '@pages/coverage-areas/infrastructure/api/dto/optical-fiber-network/optical-fiber-network-create-api.dto';

export function opticalFiberNetworkCreateMapper(
    validContract: OpticalFiberNetworkCreateValidateContract
): OpticalFiberNetworkCreateApiDto {
    return {
        name: validContract.name,
        operator: validContract.operator,
        fiber_constructor_id: validContract.fiberConstructorId,
        type: validContract.type,
        geom_file: validContract.geomFile,
    };
}
