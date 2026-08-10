import { Operator } from '@pages/coverage-areas/domain/enums/mobile-network/mobile-network-operator.enum';

export interface MobileNetworkCreateValidateContract {
    siteId: string;
    siteName: string;
    siteGroupId: string | number;
    towerTypeId: string | number;
    towerHeight: string;
    networkTechnology: string;
    operator: Operator;
    coverageRadius?: number;
}
