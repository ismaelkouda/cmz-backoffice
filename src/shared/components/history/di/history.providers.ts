import { Provider } from '@angular/core';
import { HistoryFindOneRepository } from '@shared/components/history/domain/repositories/history-find-one-repository';
import { HistoryRepository } from '@shared/components/history/domain/repositories/history.repository';
import { HistoryFindOneRepositoryImpl } from '@shared/components/history/infrastructure/data/repositories/history-find-one-repository.impl';
import { HistoryRepositoryImpl } from '@shared/components/history/infrastructure/data/repositories/history.repository.impl';

export const historyProviders = (): Provider[] => [
    {
        provide: HistoryRepository,
        useClass: HistoryRepositoryImpl,
    },
    {
        provide: HistoryFindOneRepository,
        useClass: HistoryFindOneRepositoryImpl,
    },
];
