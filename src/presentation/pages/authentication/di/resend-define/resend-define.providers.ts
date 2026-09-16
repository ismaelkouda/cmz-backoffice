import { Provider } from '@angular/core';
import { ResendDefineRepositoryImpl } from '@presentation/pages/authentication/infrastructure/data/repositories/resend-define/resend-define.repository.impl';
import { ResendDefineRepository } from '@presentation/pages/authentication/domain/repositories/resend-define/resend-define.repository';

export const resendDefineProviders: Provider[] = [
    {
        provide: ResendDefineRepository,
        useClass: ResendDefineRepositoryImpl,
    },
];
