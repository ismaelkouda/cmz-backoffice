import { Provider } from '@angular/core';
import { ApprovalRepositoryImpl } from '../data/repositories/approval.repository.impl';
import { ApprovalRepository } from '../domain/repositories/approval.repository';

export const provideApproval = (): Provider[] => [
    {
        provide: ApprovalRepository,
        useClass: ApprovalRepositoryImpl,
    },
];
