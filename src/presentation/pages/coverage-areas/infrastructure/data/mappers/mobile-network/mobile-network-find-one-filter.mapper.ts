import { MobileNetworkFindOneFilterApiDto } from '@pages/coverage-areas/infrastructure/api/dto/mobile-network/mobile-network-find-one-filter-api.dto';
import { MobileNetworkFindOneFilterValidateContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-find-one-filter.validate-contract';

export function mobileNetworkFindOneFilterMapper(
    validContract: MobileNetworkFindOneFilterValidateContract
): MobileNetworkFindOneFilterApiDto {
    const params: MobileNetworkFindOneFilterApiDto =
        {} as MobileNetworkFindOneFilterApiDto;

    if (validContract.uniqId) {
        params.id = validContract.uniqId;
    }

    return params;
}
