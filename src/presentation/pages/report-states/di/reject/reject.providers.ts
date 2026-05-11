import { Provider } from '@angular/core';
import { RejectRepository } from '@pages/report-states/domain/repositories/reject/reject.repository';
import { RejectRepositoryImpl } from '@pages/report-states/infrastructure/data/repositories/reject/reject.repository.impl';

export const provideReject: Provider[] = [
    {
        provide: RejectRepository,
        useClass: RejectRepositoryImpl,
    },
];
