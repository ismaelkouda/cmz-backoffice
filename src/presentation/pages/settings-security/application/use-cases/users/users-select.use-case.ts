import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { UsersSelectEntity } from '@presentation/pages/settings-security/domain/entities/users/users-select.entity';
import { UsersSelectRepository } from '@presentation/pages/settings-security/domain/repositories/users/users-select-repository';

@Injectable({
    providedIn: 'root',
})
export class UsersSelectUseCase {
    private readonly repository = inject(UsersSelectRepository);

    readAll(): Observable<UsersSelectEntity[]> {
        return this.repository.readAll();
    }
}
