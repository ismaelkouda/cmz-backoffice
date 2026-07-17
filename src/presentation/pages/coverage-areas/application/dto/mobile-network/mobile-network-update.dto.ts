import { Technology } from '@pages/coverage-areas/domain/enums/mobile-network/mobile-network-technology.enum';
import { Operator } from '@pages/coverage-areas/domain/enums/mobile-network/mobile-network-operator.enum';

export interface MobileNetworkUpdateDto {
    uniqId: string;
    siteId?: string;
    siteName?: string;
    towerTypeId?: string;
    towerSize?: number;
    technology?: Technology;
    operator?: Operator;
    radius?: number;
}
