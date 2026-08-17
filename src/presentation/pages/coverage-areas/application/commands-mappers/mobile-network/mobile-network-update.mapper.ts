import { MobileNetworkUpdateCommand } from '@pages/coverage-areas/application/commands/mobile-network/mobile-network-update.command';
import { MobileNetworkUpdateContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-update.contract';
import { Operator } from '@pages/coverage-areas/domain/enums/mobile-network/mobile-network-operator.enum';

export function mobileNetworkUpdateCommandMapper(
    command: MobileNetworkUpdateCommand
): MobileNetworkUpdateContract {
    return {
        uniqId: command.uniqId,
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
