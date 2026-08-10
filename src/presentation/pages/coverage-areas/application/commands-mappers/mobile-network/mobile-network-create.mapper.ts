import { MobileNetworkCreateCommand } from '@pages/coverage-areas/application/commands/mobile-network/mobile-network-create.command';
import { MobileNetworkCreateContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-create.contract';
import { Operator } from '@pages/coverage-areas/domain/enums/mobile-network/mobile-network-operator.enum';

export function mobileNetworkCreateCommandMapper(
    command: MobileNetworkCreateCommand
): MobileNetworkCreateContract {
    return {
        siteId: command.siteId,
        siteName: command.siteName,
        siteGroupId: command.siteGroupId,
        towerTypeId: command.towerTypeId,
        towerHeight: command.towerHeight,
        networkTechnology: command.networkTechnology,
        operator: command.operator as Operator | undefined,
        coverageRadius: command.coverageRadius,
    };
}
