import { Operator } from '@pages/coverage-areas/domain/enums/mobile-network/mobile-network-operator.enum';

export interface MobileNetworkFindOneProps {
    uniqId: string;
    siteId: string;
    siteName: string;
    siteGroupId: string | number;
    siteGroupName: string;
    towerTypeId: string | number;
    towerTypeName: string;
    towerHeight: string;
    networkTechnology: string;
    operator: Operator;
    coverageRadius?: number;
    updatedAt: string;
}
