import { Provider } from '@angular/core';

import { AllRepository } from '@presentation/pages/requests/domain/repositories/all/all.repository';
import { AllRepositoryImpl } from '@presentation/pages/requests/infrastructure/data/repositories/all/all.repository.impl';

export const provideAll: Provider[] = [
    {
        provide: AllRepository,
        useClass: AllRepositoryImpl,
    },
];
