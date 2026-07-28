import { MobileNetworkCreateCommand } from '@pages/coverage-areas/application/commands/mobile-network/mobile-network-create.command';
import { MobileNetworkCreateContract } from '@pages/coverage-areas/domain/contracts/mobile-network/mobile-network-create.contract';

export function mobileNetworkCreateCommandMapper(
    command: MobileNetworkCreateCommand
): MobileNetworkCreateContract {
    return command;
}
