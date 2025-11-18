import { inject, Injectable } from '@angular/core';
import { Paginate } from '@shared/interfaces/paginate';
import { Observable } from 'rxjs';
import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { UserFilter } from '../value-objects/user-filter.vo';
import {
    UserStoreRequestDto,
    UserUpdateRequestDto,
    UserDeleteResponseDto,
    UserEnableResponseDto,
    UserDisableResponseDto,
} from '@presentation/pages/settings-security/data/dtos/user-response.dto';

@Injectable({
    providedIn: 'root',
})
export class FetchUsersUseCase {
    private readonly userRepository = inject(UserRepository);

    execute(filter: UserFilter, page: string): Observable<Paginate<User>> {
        return this.userRepository.fetchUsers(filter, page);
    }
}

@Injectable({
    providedIn: 'root',
})
export class StoreUserUseCase {
    private readonly userRepository = inject(UserRepository);

    execute(payload: UserStoreRequestDto): Observable<User> {
        return this.userRepository.storeUser(payload);
    }
}

@Injectable({
    providedIn: 'root',
})
export class UpdateUserUseCase {
    private readonly userRepository = inject(UserRepository);

    execute(payload: UserUpdateRequestDto): Observable<User> {
        return this.userRepository.updateUser(payload);
    }
}

@Injectable({
    providedIn: 'root',
})
export class DeleteUserUseCase {
    private readonly userRepository = inject(UserRepository);

    execute(id: string): Observable<UserDeleteResponseDto> {
        return this.userRepository.deleteUser(id);
    }
}

@Injectable({
    providedIn: 'root',
})
export class EnableUserUseCase {
    private readonly userRepository = inject(UserRepository);

    execute(id: string): Observable<UserEnableResponseDto> {
        return this.userRepository.enableUser(id);
    }
}

@Injectable({
    providedIn: 'root',
})
export class DisableUserUseCase {
    private readonly userRepository = inject(UserRepository);

    execute(id: string): Observable<UserDisableResponseDto> {
        return this.userRepository.disableUser(id);
    }
}
