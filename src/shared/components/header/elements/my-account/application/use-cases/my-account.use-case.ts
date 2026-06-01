import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { PasswordChangeEntity } from '../../domain/entities/password-change.entity';
import { ProfileUpdateEntity } from '../../domain/entities/profile-update.entity';
// import { RequestTwoFactorEntity } from '../../domain/entities/two-factor-request.entity';
// import {
//     TwoFactorChallengeEntity,
//     TwoFactorEntity,
// } from '../../domain/entities/two-factor.entity';
import { MyAccountRepository } from '../../domain/repositories/my-account.repository';
import { PasswordChangeVo } from '../../domain/value-objects/password-change.vo';
import { ProfileUpdateVo } from '../../domain/value-objects/profile-update.vo';
// import { TwoFactorVo } from '../../domain/value-objects/two-factor.vo';
import { PasswordChangeDto } from '../dto/password-change.dto';
// import { RequestTwoFactorDto } from '../dto/two-factor-request.dto';
// import { TwoFactorRequestDto, TwoFactorVerifyDto } from '../dto/two-factor.dto';
import { ProfileUpdateDto } from '../dto/profile-update.dto';
import { MessageEntity } from '@shared/domain/entities/message.entity';

@Injectable({ providedIn: 'root' })
export class MyAccountUseCase {
    private readonly repository = inject(MyAccountRepository);

    logout(): Observable<MessageEntity> {
        return this.repository.logout();
    }

    updatePassword(payload: PasswordChangeDto): Observable<MessageEntity> {
        const vo = PasswordChangeVo.fromDto(payload);
        return this.repository.updatePassword(PasswordChangeEntity.fromVo(vo));
    }

    updateProfile(payload: ProfileUpdateDto): Observable<MessageEntity> {
        const vo = ProfileUpdateVo.fromDto(payload);
        return this.repository.updateProfile(ProfileUpdateEntity.fromVo(vo));
    }

    // requestTwoFactor(
    //     payload: RequestTwoFactorDto
    // ): Observable<TwoFactorChallengeEntity> {
    //     return this.repository.requestTwoFactor(
    //         RequestTwoFactorEntity.fromDto(payload)
    //     );
    // }

    // verifyTwoFactorEnable(
    //     payload: TwoFactorVerifyDto
    // ): Observable<MessageEntity> {
    //     const vo = TwoFactorVo.fromVerifyDto(payload);
    //     return this.repository.verifyTwoFactorEnable(
    //         TwoFactorEntity.fromVo(vo)
    //     );
    // }

    // disableTwoFactor(
    //     payload: TwoFactorRequestDto
    // ): Observable<MessageEntity> {
    //     const vo = TwoFactorVo.fromRequestDto(payload);
    //     return this.repository.disableTwoFactor(TwoFactorEntity.fromVo(vo));
    // }
}
