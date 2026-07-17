import { MobileNetworkDisableApiDto } from '@pages/coverage-areas/infrastructure/api/dto/mobile-network/mobile-network-disable-api.dto';
import { MobileNetworkDisableValidateContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-disable.validate-contract';

export function mobileNetworkDisableMapper(
    validContract: MobileNetworkDisableValidateContract
): MobileNetworkDisableApiDto {
    const params = {} as MobileNetworkDisableApiDto;
    if (validContract.uniqId) {
        params.uniq_id = validContract.uniqId;
    }
    return params;
}
