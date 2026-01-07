import { inject, Injectable } from '@angular/core';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { Observable } from 'rxjs';
import { UsersStorePayloadEntity } from '../entities/users/users-store-payload.entity';
import { UsersUpdatePayloadEntity } from '../entities/users/users-update-payload.entity';
import { UsersEntity } from '../entities/users/users.entity';
import { UserRepository } from '../repositories/user.repository';
import { UserFilter } from '../value-objects/user-filter.vo';

@Injectable({
    providedIn: 'root',
})
export class FetchUsersUseCase {
    private readonly userRepository = inject(UserRepository);

    execute(
        filter: UserFilter,
        page: string
    ): Observable<Paginate<UsersEntity>> {
        return this.userRepository.fetchUsers(filter, page);
    }
}

@Injectable({
    providedIn: 'root',
})
export class StoreUserUseCase {
    private readonly userRepository = inject(UserRepository);

    execute(payload: UsersStorePayloadEntity): Observable<UsersEntity> {
        return this.userRepository.storeUser(payload);
    }
}

@Injectable({
    providedIn: 'root',
})
export class UpdateUserUseCase {
    private readonly userRepository = inject(UserRepository);

    execute(payload: UsersUpdatePayloadEntity): Observable<UsersEntity> {
        return this.userRepository.updateUser(payload);
    }
}

@Injectable({
    providedIn: 'root',
})
export class DeleteUserUseCase {
    private readonly userRepository = inject(UserRepository);

    execute(id: string): Observable<void> {
        return this.userRepository.deleteUser(id);
    }
}

@Injectable({
    providedIn: 'root',
})
export class EnableUserUseCase {
    private readonly userRepository = inject(UserRepository);

    execute(id: string): Observable<void> {
        return this.userRepository.enableUser(id);
    }
}

@Injectable({
    providedIn: 'root',
})
export class DisableUserUseCase {
    private readonly userRepository = inject(UserRepository);

    execute(id: string): Observable<void> {
        return this.userRepository.disableUser(id);
    }
}
