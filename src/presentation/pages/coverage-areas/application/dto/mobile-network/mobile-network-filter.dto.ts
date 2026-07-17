import { Technology } from '@pages/coverage-areas/domain/enums/mobile-network/mobile-network-technology.enum';
import { Operator } from '@pages/coverage-areas/domain/enums/mobile-network/mobile-network-operator.enum';

export interface MobileNetworkFilterDto {
    search?: string;
    towerTypeId?: string;
    towerSize?: number;
    technology?: Technology;
    operator?: Operator;
    radius?: number;
    startDate?: Date;
    endDate?: Date;
}
