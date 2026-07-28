import { OpticalFiberNetworkEnableCommand } from '@pages/coverage-areas/application/commands/optical-fiber-network/optical-fiber-network-enable.command';
import { OpticalFiberNetworkEnableContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-enable.contract';

export function opticalFiberNetworkEnableCommandMapper(
    command: OpticalFiberNetworkEnableCommand
): OpticalFiberNetworkEnableContract {
    return command;
}
