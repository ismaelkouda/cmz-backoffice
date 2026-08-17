import { OpticalFiberNetworkDisableCommand } from '@pages/coverage-areas/application/commands/optical-fiber-network/optical-fiber-network-disable.command';
import { OpticalFiberNetworkDisableContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-disable.contract';

export function opticalFiberNetworkDisableCommandMapper(
    command: OpticalFiberNetworkDisableCommand
): OpticalFiberNetworkDisableContract {
    return command;
}
