import { MobileNetworkUpdateCommand } from '@pages/coverage-areas/application/commands/mobile-network/mobile-network-update.command';
import { MobileNetworkUpdateContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-update.contract';

export function mobileNetworkUpdateCommandMapper(
    command: MobileNetworkUpdateCommand
): MobileNetworkUpdateContract {
    return command;
}
