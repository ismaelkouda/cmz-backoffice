import { MobileNetworkEnableApiDto } from '@pages/coverage-areas/infrastructure/api/dto/mobile-network/mobile-network-enable-api.dto';
import { MobileNetworkEnableValidateContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-enable.validate-contract';

export function mobileNetworkEnableMapper(
    validContract: MobileNetworkEnableValidateContract
): MobileNetworkEnableApiDto {
    const params = {} as MobileNetworkEnableApiDto;
    if (validContract.uniqId) {
        params.uniq_id = validContract.uniqId;
    }
    return params;
}
