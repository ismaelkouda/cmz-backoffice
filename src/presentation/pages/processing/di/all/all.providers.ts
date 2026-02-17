import { Provider } from '@angular/core';

import { AllRepository } from '@presentation/pages/processing/domain/repositories/all/all.repository';
import { AllRepositoryImpl } from '@presentation/pages/processing/infrastructure/data/repositories/all/all.repository.impl';

export const provideAll: Provider[] = [
    {
        provide: AllRepository,
        useClass: AllRepositoryImpl,
    },
];
