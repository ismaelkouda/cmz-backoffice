import { Provider } from '@angular/core';
import { FiberConstructorSelectRepository } from '@pages/coverage-areas/domain/repositories/fiber-constructor/fiber-constructor-select.repository';
import { FiberConstructorSelectRepositoryImpl } from '@pages/coverage-areas/infrastructure/data/repositories/fiber-constructor/fiber-constructor-select.repository.impl';

export const fiberConstructorSelectProviders: Provider[] = [
    {
        provide: FiberConstructorSelectRepository,
        useClass: FiberConstructorSelectRepositoryImpl,
    },
];
