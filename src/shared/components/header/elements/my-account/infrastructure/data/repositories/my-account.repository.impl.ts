import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

// import { MyAccountResultEntity } from '../../../domain/entities/my-account-result.entity';
import { PasswordChangeEntity } from '../../../domain/entities/password-change.entity';
import { ProfileUpdateEntity } from '../../../domain/entities/profile-update.entity';
// import {
//     TwoFactorChallengeEntity,
//     TwoFactorEntity,
// } from '../../../domain/entities/two-factor.entity';
import { MyAccountRepository } from '../../../domain/repositories/my-account.repository';
import { MyAccountApi } from '../../api/my-account.api';
// import { MyAccountMapper } from '../mappers/my-account.mapper';
import { passwordChangeMapper } from '../mappers/password-change.mapper';
import { profileUpdateMapper } from '../mappers/profile-update.mapper';
import { MessageEntity } from '@shared/domain/entities/message.entity';
import { MessageResultMapper } from '@shared/data/mappers/message-result.mapper';
// import {
//     requestTwoFactorRequestMapper,
//     twoFactorEnableMapper,
// } from '../mappers/two-factor-enable.mapper';
// import { RequestTwoFactorEntity } from '../../../domain/entities/two-factor-request.entity';
// import { twoFactorDisableMapper } from '../mappers/two-factor-disable.mapper';

@Injectable()
export class MyAccountRepositoryImpl extends MyAccountRepository {
    private readonly api = inject(MyAccountApi);
    private readonly messageMapper = inject(MessageResultMapper);
    // private readonly mapper = inject(MyAccountMapper);

    logout(): Observable<MessageEntity> {
        return this.api
            .logout()
            .pipe(
                map((response) => this.messageMapper.mapFromMessage(response))
            );
    }
    updatePassword(payload: PasswordChangeEntity): Observable<MessageEntity> {
        const dto = passwordChangeMapper(payload);
        return this.api
            .passwordChange(dto)
            .pipe(
                map((response) => this.messageMapper.mapFromMessage(response))
            );
    }
    updateProfile(payload: ProfileUpdateEntity): Observable<MessageEntity> {
        const dto = profileUpdateMapper(payload);
        return this.api
            .profileUpdate(dto)
            .pipe(
                map((response) => this.messageMapper.mapFromMessage(response))
            );
    }

    // twoFactorRequest(
    //     payload: RequestTwoFactorEntity
    // ): Observable<RequestTwoFactorEntity> {
    //     const dto = requestTwoFactorRequestMapper(payload);
    //     return this.api
    //         .twoFactorRequest(dto)
    //         .pipe(map((response) => twoFactorRequest(response)));
    // }

    // twoFactorEnable(payload: TwoFactorEntity): Observable<MessageEntity> {
    //     const dto = twoFactorEnableMapper(payload);
    //     return this.api
    //         .twoFactorEnable(dto)
    //         .pipe(
    //             map((response) => this.messageMapper.mapFromMessage(response))
    //         );
    // }

    // twoFactorDisable(payload: TwoFactorEntity): Observable<MessageEntity> {
    //     const dto = twoFactorDisableMapper(payload);
    //     return this.api
    //         .twoFactorDisable(dto)
    //         .pipe(
    //             map((response) => this.messageMapper.mapFromMessage(response))
    //         );
    // }
}
