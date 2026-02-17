import { Provider } from '@angular/core';

import { HistoryFindonRepositoryImpl } from '@shared/components/history/infrastructure/data/repositories/history-findone-repository.impl';

import { HistoryFindOneUseCase } from '../core/application/use-cases/history-find-one.use-case';
import { HistoryFindOneRepository } from '../core/domain/repositories/history-findone-repository';

export const historyFindoneProviders: Provider[] = [
    HistoryFindOneUseCase,
    {
        provide: HistoryFindOneRepository,
        useClass: HistoryFindonRepositoryImpl,
    },
];
