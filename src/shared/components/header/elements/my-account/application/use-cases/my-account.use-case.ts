// import { Injectable, inject } from '@angular/core';
// import { Observable } from 'rxjs';

// import { PasswordEntity } from '../../domain/entities/password-change.entity';
// import { ProfileEntity } from '../../domain/entities/profile-update.entity';
// import { RequestTwoFactorEntity } from '../../domain/entities/two-factor-request.entity';
// import {
//     TwoFactorChallengeEntity,
//     TwoFactorEntity,
// } from '../../domain/entities/two-factor.entity';
// import { MyAccountRepository } from '../../domain/repositories/my-account.repository';
// import { PasswordVo } from '../../domain/value-objects/password-change.vo';
// import { ProfileVo } from '../../domain/value-objects/profile-update.vo';
// import { TwoFactorVo } from '../../domain/value-objects/two-factor.vo';
// import { ChangePasswordDto } from '../dto/password-change.dto';
// import { RequestTwoFactorDto } from '../dto/two-factor-request.dto';
// import { TwoFactorRequestDto, TwoFactorVerifyDto } from '../dto/two-factor.dto';
// import { UpdateProfileDto } from '../dto/profile-update.dto';
// import { MessageEntity } from '@shared/domain/entities/message.entity';

// @Injectable({ providedIn: 'root' })
// export class MyAccountUseCase {
//     private readonly repository = inject(MyAccountRepository);

//     logout(): Observable<MessageEntity> {
//         return this.repository.logout();
//     }

//     updatePassword(payload: ChangePasswordDto): Observable<MessageEntity> {
//         const vo = PasswordVo.fromDto(payload);
//         return this.repository.updatePassword(PasswordEntity.fromVo(vo));
//     }

//     updateProfile(payload: UpdateProfileDto): Observable<MessageEntity> {
//         const vo = ProfileVo.fromDto(payload);
//         return this.repository.updateProfile(ProfileEntity.fromVo(vo));
//     }

//     requestTwoFactor(
//         payload: RequestTwoFactorDto
//     ): Observable<TwoFactorChallengeEntity> {
//         return this.repository.requestTwoFactor(
//             RequestTwoFactorEntity.fromDto(payload)
//         );
//     }

//     verifyTwoFactorEnable(
//         payload: TwoFactorVerifyDto
//     ): Observable<MessageEntity> {
//         const vo = TwoFactorVo.fromVerifyDto(payload);
//         return this.repository.verifyTwoFactorEnable(
//             TwoFactorEntity.fromVo(vo)
//         );
//     }

//     disableTwoFactor(
//         payload: TwoFactorRequestDto
//     ): Observable<MessageEntity> {
//         const vo = TwoFactorVo.fromRequestDto(payload);
//         return this.repository.disableTwoFactor(TwoFactorEntity.fromVo(vo));
//     }
// }
