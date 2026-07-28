import { OpticalFiberNetworkCreateCommand } from '@pages/coverage-areas/application/commands/optical-fiber-network/optical-fiber-network-create.command';
import { OpticalFiberNetworkCreateContract } from '@pages/coverage-areas/domain/contracts/optical-fiber-network/optical-fiber-network-create.contract';

export function opticalFiberNetworkCreateCommandMapper(
    command: OpticalFiberNetworkCreateCommand
): OpticalFiberNetworkCreateContract {
    return command;
}
