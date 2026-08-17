import { Provider } from '@angular/core';
import { AllRepository } from '@pages/processing/domain/repositories/all/all.repository';
import { AllRepositoryImpl } from '@pages/processing/infrastructure/data/repositories/all/all.repository.impl';

export const provideAll: Provider[] = [
    {
        provide: AllRepository,
        useClass: AllRepositoryImpl,
    },
];
