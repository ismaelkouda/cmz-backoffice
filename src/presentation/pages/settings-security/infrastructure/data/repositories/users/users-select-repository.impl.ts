import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { UsersSelectEntity } from '@presentation/pages/settings-security/domain/entities/users/users-select.entity';
import { UsersSelectRepository } from '@presentation/pages/settings-security/domain/repositories/users/users-select-repository';
import { UsersSelectMapper } from '@presentation/pages/settings-security/infrastructure/data/mappers/users/users-select.mapper';
import { UsersSelectApi } from '@presentation/pages/settings-security/infrastructure/data/sources/users/users-select.api';

@Injectable({ providedIn: 'root' })
export class UsersSelectRepositoryImpl implements UsersSelectRepository {
    private readonly api = inject(UsersSelectApi);
    private readonly mapper = inject(UsersSelectMapper);

    readAll(): Observable<UsersSelectEntity[]> {
        return this.api
            .readAll()
            .pipe(map((dto) => this.mapper.mapFromDto(dto)));
    }
}
