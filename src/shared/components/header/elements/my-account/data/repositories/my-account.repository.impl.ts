import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { LogoutEntity } from '../../domain/entities/logout.entity';
import { MyAccountRepository } from '../../domain/repositories/my-account.repository';
import { ChangePasswordRequestDto } from '../dtos/change-password-request.dto';
import { UpdateProfileRequestDto } from '../dtos/update-profile-request.dto';
import { MyAccountMapper } from '../mappers/my-account.mapper';
import { MyAccountApi } from '../sources/my-account.api';

@Injectable({ providedIn: 'root' })
export class MyAccountRepositoryImpl extends MyAccountRepository {
    constructor(
        private readonly myAccountApi: MyAccountApi,
        private readonly myAccountMapper: MyAccountMapper
    ) {
        super();
    }

    fetchLogout(): Observable<LogoutEntity> {
        return this.myAccountApi
            .fetchLogout()
            .pipe(map((response) => this.myAccountMapper.mapFromDto(response)));
    }

    updatePassword(
        payload: ChangePasswordRequestDto
    ): Observable<void> {
        return this.myAccountApi
            .updatePassword(payload)
            .pipe(map(() => void 0));
    }

    updateProfile(
        payload: UpdateProfileRequestDto
    ): Observable<void> {
        return this.myAccountApi
            .updateProfile(payload)
            .pipe(map(() => void 0));
    }
}
