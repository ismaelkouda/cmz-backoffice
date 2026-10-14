import { Provider } from '@angular/core';
import { RequestRepository } from '@pages/report-states/domain/repositories/request/request.repository';
import { RequestRepositoryImpl } from '@pages/report-states/infrastructure/data/repositories/request/request.repository.impl';

export const provideRequest: Provider[] = [
    {
        provide: RequestRepository,
        useClass: RequestRepositoryImpl,
    },
];
