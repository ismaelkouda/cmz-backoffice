import { Provider } from '@angular/core';

import { HistoryFindOneUseCase } from '@shared/components/history/application/use-cases/history-find-one.use-case';
import { HistoryFindOneRepository } from '@shared/components/history/domain/repositories/history-findone-repository';
import { HistoryFindonRepositoryImpl } from '@shared/components/history/infrastructure/data/repositories/history-findone-repository.impl';

export const historyFindoneProviders: Provider[] = [
    HistoryFindOneUseCase,
    {
        provide: HistoryFindOneRepository,
        useClass: HistoryFindonRepositoryImpl,
    },
];
