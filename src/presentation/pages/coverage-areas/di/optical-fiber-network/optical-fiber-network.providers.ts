import { Provider } from '@angular/core';
import { OpticalFiberNetworkRepository } from '@pages/coverage-areas/domain/repositories/optical-fiber-network/optical-fiber-network.repository';
import { OpticalFiberNetworkRepositoryImpl } from '@pages/coverage-areas/infrastructure/data/repositories/optical-fiber-network/optical-fiber-network.repository.impl';

export const opticalFiberNetworkProviders: Provider[] = [
    {
        provide: OpticalFiberNetworkRepository,
        useClass: OpticalFiberNetworkRepositoryImpl,
    },
];
