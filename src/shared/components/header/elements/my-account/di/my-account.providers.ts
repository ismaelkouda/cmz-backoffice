import { Provider } from '@angular/core';

import { MyAccountRepository } from '../domain/repositories/my-account.repository';
import { MyAccountRepositoryImpl } from '../infrastructure/data/repositories/my-account.repository.impl';

export function provideMyAccount(): Provider[] {
    return [
        {
            provide: MyAccountRepository,
            useClass: MyAccountRepositoryImpl,
        },
    ];
}
