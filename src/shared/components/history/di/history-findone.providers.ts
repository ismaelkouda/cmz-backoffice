import { Provider } from '@angular/core';

import { HistoryFindonUseCase } from '@shared/components/history/core/application/use-cases/history-findone.use-case';
import { HistoryFindonRepository } from '@shared/components/history/core/domain/repositories/history-findone-repository';
import { HistoryFindonMapper } from '@shared/components/history/infrastructure/data/mappers/history-findone.mapper';
import { HistoryFindonRepositoryImpl } from '@shared/components/history/infrastructure/data/repositories/history-findone-repository.impl';
import { HistoryFindonApi } from '@shared/components/history/infrastructure/data/sources/history-findone.api';

export const historyFindoneProviders: Provider[] = [
    HistoryFindonApi,
    HistoryFindonMapper,
    HistoryFindonUseCase,
    {
        provide: HistoryFindonRepository,
        useClass: HistoryFindonRepositoryImpl,
    },
];
