import { MobileNetworkUpdateCommand } from '@pages/coverage-areas/application/commands/mobile-network/mobile-network-update.command';
import { MobileNetworkUpdateContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-update.contract';

export function mobileNetworkUpdateCommandMapper(
    command: MobileNetworkUpdateCommand
): MobileNetworkUpdateContract {
    return {
        uniqId: command.uniqId,
        siteId: command.siteId,
        siteName: command.siteName,
        towerTypeId: command.towerTypeId,
        towerSize: command.towerSize,
        technology: command.technology,
        operator: command.operator,
        radius: command.radius,
    };
}
