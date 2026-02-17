import { Provider } from '@angular/core';

import { DetailsRepository } from '@presentation/pages/finalization/domain/repositories/details/details-repository';
import { DetailsRepositoryImpl } from '@presentation/pages/finalization/infrastructure/data/repositories/details/details-repository.impl';

export const provideDetails: Provider[] = [
    {
        provide: DetailsRepository,
        useClass: DetailsRepositoryImpl,
    },
];
