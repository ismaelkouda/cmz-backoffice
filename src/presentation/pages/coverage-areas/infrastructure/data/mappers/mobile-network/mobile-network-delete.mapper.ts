import { MobileNetworkDeleteApiDto } from '@pages/coverage-areas/infrastructure/api/dto/mobile-network/mobile-network-delete-api.dto';
import { MobileNetworkDeleteValidateContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-delete.validate-contract';

export function mobileNetworkDeleteMapper(
    validContract: MobileNetworkDeleteValidateContract
): MobileNetworkDeleteApiDto {
    const params = {} as MobileNetworkDeleteApiDto;
    if (validContract.uniqId) {
        params.uniq_id = validContract.uniqId;
    }
    return params;
}
