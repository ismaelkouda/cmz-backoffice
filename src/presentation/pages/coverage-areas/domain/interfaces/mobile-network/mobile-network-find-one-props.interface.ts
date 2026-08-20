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
    operator: string;
    coverageRadius: number;
    updatedAt: string;
}
