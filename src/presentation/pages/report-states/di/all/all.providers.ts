import { Provider } from '@angular/core';
import { AllRepository } from '@pages/report-states/domain/repositories/all/all.repository';
import { AllRepositoryImpl } from '@pages/report-states/infrastructure/data/repositories/all/all.repository.impl';

export const provideAll: Provider[] = [
    {
        provide: AllRepository,
        useClass: AllRepositoryImpl,
    },
];
