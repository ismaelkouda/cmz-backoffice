import { Provider } from '@angular/core';
import { MobileNetworkFindOneUseCase } from '@pages/coverage-areas/application/use-cases/mobile-network/mobile-network-find-one.use-case';
import { MobileNetworkFindOneRepository } from '@pages/coverage-areas/domain/repositories/mobile-network/mobile-network-find-one.repository';
import { MobileNetworkFindOneMapper } from '@pages/coverage-areas/infrastructure/data/mappers/mobile-network/mobile-network-find-one.mapper';
import { MobileNetworkFindOneRepositoryImpl } from '@pages/coverage-areas/infrastructure/data/repositories/mobile-network/mobile-network-find-one.repository.impl';
import { MobileNetworkFindOneApi } from '@pages/coverage-areas/infrastructure/data/sources/mobile-network/mobile-network-find-one.api';

export const mobileNetworkFindOneProviders: Provider[] = [
    MobileNetworkFindOneApi,
    MobileNetworkFindOneMapper,
    MobileNetworkFindOneUseCase,
    {
        provide: MobileNetworkFindOneRepository,
        useClass: MobileNetworkFindOneRepositoryImpl,
    },
];
