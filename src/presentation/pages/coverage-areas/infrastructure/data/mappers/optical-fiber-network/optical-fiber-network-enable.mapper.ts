import { OpticalFiberNetworkEnableValidateContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-enable.validate-contract';
import { OpticalFiberNetworkEnableApiDto } from '@pages/coverage-areas/infrastructure/api/dto/optical-fiber-network/optical-fiber-network-enable-api.dto';

export function opticalFiberNetworkEnableMapper(
    validContract: OpticalFiberNetworkEnableValidateContract
): OpticalFiberNetworkEnableApiDto {
    return {
        uniq_id: validContract.uniqId,
    };
}
