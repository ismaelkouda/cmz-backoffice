import { Provider } from '@angular/core';

import { DetailsRepository } from '@presentation/pages/processing/domain/repositories/details/details-repository';
import { DetailsRepositoryImpl } from '@presentation/pages/processing/infrastructure/data/repositories/details/details-repository.impl';

export const provideDetails: Provider[] = [
    {
        provide: DetailsRepository,
        useClass: DetailsRepositoryImpl,
    },
];
