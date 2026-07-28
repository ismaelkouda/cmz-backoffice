import { OpticalFiberNetworkUpdateCommand } from '@pages/coverage-areas/application/commands/optical-fiber-network/optical-fiber-network-update.command';
import { OpticalFiberNetworkUpdateContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-update.contract';

export function opticalFiberNetworkUpdateCommandMapper(
    command: OpticalFiberNetworkUpdateCommand
): OpticalFiberNetworkUpdateContract {
    return command;
}
