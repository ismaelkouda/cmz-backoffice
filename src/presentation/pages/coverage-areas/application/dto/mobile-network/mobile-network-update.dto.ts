export interface MobileNetworkUpdateDto {
    uniqId: string;
    siteId?: string;
    siteName?: string;
    siteGroupId?: string | number;
    towerTypeId?: string | number;
    towerHeight?: string;
    networkTechnology?: string;
    operator?: string;
    coverageRadius?: number;
}
