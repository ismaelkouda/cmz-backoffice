import { MobileNetworkDisableCommand } from '@pages/coverage-areas/application/commands/mobile-network/mobile-network-disable.command';
import { MobileNetworkDisableContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-disable.contract';

export function mobileNetworkDisableCommandMapper(
    command: MobileNetworkDisableCommand
): MobileNetworkDisableContract {
    return command;
}
