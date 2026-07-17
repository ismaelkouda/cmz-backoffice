import { Provider } from '@angular/core';
import { MobileNetworkRepository } from '@pages/coverage-areas/domain/repositories/mobile-network/mobile-network.repository';
import { MobileNetworkRepositoryImpl } from '@pages/coverage-areas/infrastructure/data/repositories/mobile-network/mobile-network.repository.impl';

export const mobileNetworkProviders: Provider[] = [
    {
        provide: MobileNetworkRepository,
        useClass: MobileNetworkRepositoryImpl,
    },
];
