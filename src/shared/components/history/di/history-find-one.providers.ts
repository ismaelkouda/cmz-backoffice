import { Provider } from '@angular/core';

import { HistoryFindOneUseCase } from '@shared/components/history/application/use-cases/history-find-one.use-case';
import { HistoryFindOneRepository } from '@shared/components/history/domain/repositories/history-find-one-repository';
import { HistoryFindOneRepositoryImpl } from '@shared/components/history/infrastructure/data/repositories/history-find-one-repository.impl';

export const historyFindOneProviders: Provider[] = [
    HistoryFindOneUseCase,
    {
        provide: HistoryFindOneRepository,
        useClass: HistoryFindOneRepositoryImpl,
    },
];
