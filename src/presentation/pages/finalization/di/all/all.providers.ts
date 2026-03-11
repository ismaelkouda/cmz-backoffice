import { Provider } from '@angular/core';
import { AllRepository } from '@pages/finalization/domain/repositories/all/all.repository';
import { AllRepositoryImpl } from '@pages/finalization/infrastructure/data/repositories/all/all.repository.impl';

export const provideAll: Provider[] = [
    {
        provide: AllRepository,
        useClass: AllRepositoryImpl,
    },
];
