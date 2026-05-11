import { Provider } from '@angular/core';
import { CloseRepository } from '@pages/report-states/domain/repositories/close/close.repository';
import { CloseRepositoryImpl } from '@pages/report-states/infrastructure/data/repositories/close/close.repository.impl';

export const provideClose: Provider[] = [
    {
        provide: CloseRepository,
        useClass: CloseRepositoryImpl,
    },
];
