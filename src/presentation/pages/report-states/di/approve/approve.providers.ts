import { Provider } from '@angular/core';
import { ApproveRepository } from '@pages/report-states/domain/repositories/approve/approve.repository';
import { ApproveRepositoryImpl } from '@pages/report-states/infrastructure/data/repositories/approve/approve.repository.impl';

export const provideApprove: Provider[] = [
    {
        provide: ApproveRepository,
        useClass: ApproveRepositoryImpl,
    },
];
