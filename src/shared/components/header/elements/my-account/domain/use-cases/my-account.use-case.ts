import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ChangePasswordRequestDto } from '../../data/dtos/change-password-request.dto';
import { UpdateProfileRequestDto } from '../../data/dtos/update-profile-request.dto';
import { LogoutEntity } from '../entities/logout.entity';
import { MyAccountRepository } from '../repositories/my-account.repository';

@Injectable({
    providedIn: 'root',
})
export class MyAccountUseCase {
    private readonly myAccountRepository = inject(MyAccountRepository);

    executeFetchTake(): Observable<LogoutEntity> {
        return this.myAccountRepository.fetchLogout();
    }

    executeUpdatePassword(
        payload: ChangePasswordRequestDto
    ): Observable<void> {
        return this.myAccountRepository.updatePassword(payload);
    }

    executeUpdateProfile(
        payload: UpdateProfileRequestDto
    ): Observable<void> {
        return this.myAccountRepository.updateProfile(payload);
    }
}
