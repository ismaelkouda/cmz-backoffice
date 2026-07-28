import { MobileNetworkEnableCommand } from '@pages/coverage-areas/application/commands/mobile-network/mobile-network-enable.command';
import { MobileNetworkEnableContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-enable.contract';

export function mobileNetworkEnableCommandMapper(
    command: MobileNetworkEnableCommand
): MobileNetworkEnableContract {
    return command;
}
