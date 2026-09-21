import { OpticalFiberNetworkCreateValidateContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-create.validate-contract';
import { OpticalFiberNetworkCreateApiDto } from '@pages/coverage-areas/infrastructure/api/dto/optical-fiber-network/optical-fiber-network-create-api.dto';

export function opticalFiberNetworkCreateMapper(
    validContract: OpticalFiberNetworkCreateValidateContract
): OpticalFiberNetworkCreateApiDto {
    const params: OpticalFiberNetworkCreateApiDto = {
        name: validContract.name,
        operator: validContract.operator.toLocaleUpperCase(),
        fiber_constructor_id: validContract.fiberConstructorId,
        type: validContract.type,
    };
    if (validContract.geomList) {
        params.geom_list = validContract.geomList;
    }
    if (validContract.geomFile) {
        params.geom_file = validContract.geomFile;
    }
    return params;
}
