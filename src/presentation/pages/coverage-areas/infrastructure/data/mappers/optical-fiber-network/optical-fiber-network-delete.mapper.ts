import { OpticalFiberNetworkDeleteValidateContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-delete.validate-contract';
import { OpticalFiberNetworkDeleteApiDto } from '@pages/coverage-areas/infrastructure/api/dto/optical-fiber-network/optical-fiber-network-delete-api.dto';

export function opticalFiberNetworkDeleteMapper(
    validContract: OpticalFiberNetworkDeleteValidateContract
): OpticalFiberNetworkDeleteApiDto {
    return {
        uniq_id: validContract.uniqId,
    };
}
