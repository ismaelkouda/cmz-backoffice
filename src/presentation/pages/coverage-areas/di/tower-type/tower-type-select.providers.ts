import { Provider } from '@angular/core';
import { TowerTypeSelectRepository } from '@pages/coverage-areas/domain/repositories/tower-type/tower-type-select.repository';
import { TowerTypeSelectRepositoryImpl } from '@pages/coverage-areas/infrastructure/data/repositories/tower-type/tower-type-select.repository.impl';

export const towerTypeSelectProviders: Provider[] = [
    {
        provide: TowerTypeSelectRepository,
        useClass: TowerTypeSelectRepositoryImpl,
    },
];
