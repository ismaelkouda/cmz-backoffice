import { OpticalFiberNetworkDisableValidateContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-disable.validate-contract';
import { OpticalFiberNetworkDisableApiDto } from '@pages/coverage-areas/infrastructure/api/dto/optical-fiber-network/optical-fiber-network-disable-api.dto';

export function opticalFiberNetworkDisableMapper(
    validContract: OpticalFiberNetworkDisableValidateContract
): OpticalFiberNetworkDisableApiDto {
    return {
        uniq_id: validContract.uniqId,
    };
}
