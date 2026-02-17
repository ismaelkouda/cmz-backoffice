import { Provider } from '@angular/core';

import { DetailsRepository } from '@presentation/pages/requests/domain/repositories/details/details-repository';
import { DetailsRepositoryImpl } from '@presentation/pages/requests/infrastructure/data/repositories/details/details-repository.impl';

export const provideDetails: Provider[] = [
    {
        provide: DetailsRepository,
        useClass: DetailsRepositoryImpl,
    },
];
