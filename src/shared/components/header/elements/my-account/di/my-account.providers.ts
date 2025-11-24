import { Provider } from '@angular/core';
import { MyAccountRepositoryImpl } from '../data/repositories/my-account.repository.impl';
import { MyAccountApi } from '../data/sources/my-account.api';
import { MyAccountRepository } from '../domain/repositories/my-account.repository';

export function provideMyAccount(): Provider[] {
    return [
        MyAccountApi,
        MyAccountRepositoryImpl,
        {
            provide: MyAccountRepository,
            useExisting: MyAccountRepositoryImpl,
        },
    ];
}
