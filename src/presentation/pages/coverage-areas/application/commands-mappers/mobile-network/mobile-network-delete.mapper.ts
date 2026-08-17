import { MobileNetworkDeleteCommand } from '@pages/coverage-areas/application/commands/mobile-network/mobile-network-delete.command';
import { MobileNetworkDeleteContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-delete.contract';

export function mobileNetworkDeleteCommandMapper(
    command: MobileNetworkDeleteCommand
): MobileNetworkDeleteContract {
    return command;
}
