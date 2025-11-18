import { Provider } from '@angular/core';
import { WaitingMapper } from '@presentation/pages/report-requests/data/mappers/waiting.mapper';
import { WaitingRepositoryImpl } from '@presentation/pages/report-requests/data/repositories/waiting.repository.impl';
import { WaitingApi } from '@presentation/pages/report-requests/data/sources/waiting.api';
import { WaitingRepository } from '@presentation/pages/report-requests/domain/repositories/waiting.repository';

export function provideWaiting(): Provider[] {
    return [
        WaitingApi,
        WaitingMapper,
        WaitingRepositoryImpl,
        {
            provide: WaitingRepository,
            useExisting: WaitingRepositoryImpl,
        },
    ];
}
