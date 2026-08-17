import { OpticalFiberNetworkDeleteCommand } from '@pages/coverage-areas/application/commands/optical-fiber-network/optical-fiber-network-delete.command';
import { OpticalFiberNetworkDeleteContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-delete.contract';

export function opticalFiberNetworkDeleteCommandMapper(
    command: OpticalFiberNetworkDeleteCommand
): OpticalFiberNetworkDeleteContract {
    return command;
}
