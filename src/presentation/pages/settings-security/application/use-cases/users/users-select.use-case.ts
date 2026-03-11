import { inject, Injectable } from '@angular/core';
import { UsersSelectEntity } from '@pages/settings-security/domain/entities/users/users-select.entity';
import { UsersSelectRepository } from '@pages/settings-security/domain/repositories/users/users-select-repository';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UsersSelectUseCase {
    private readonly repository = inject(UsersSelectRepository);

    readAll(): Observable<UsersSelectEntity[]> {
        return this.repository.readAll();
    }
}
