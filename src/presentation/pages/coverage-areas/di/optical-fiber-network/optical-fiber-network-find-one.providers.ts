import { Provider } from '@angular/core';
import { OpticalFiberNetworkFindOneRepository } from '@pages/coverage-areas/domain/repositories/optical-fiber-network/optical-fiber-network-find-one.repository';
import { OpticalFiberNetworkFindOneRepositoryImpl } from '@pages/coverage-areas/infrastructure/data/repositories/optical-fiber-network/optical-fiber-network-find-one.repository.impl';

export const opticalFiberNetworkFindOneProviders: Provider[] = [
    {
        provide: OpticalFiberNetworkFindOneRepository,
        useClass: OpticalFiberNetworkFindOneRepositoryImpl,
    },
];
