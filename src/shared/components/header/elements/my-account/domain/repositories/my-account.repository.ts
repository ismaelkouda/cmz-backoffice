// import { Observable } from 'rxjs';

// import { PasswordEntity } from '../entities/password-change.entity';
// import { ProfileEntity } from '../entities/profile-update.entity';
// import { RequestTwoFactorEntity } from '../entities/two-factor-request.entity';
// import {
//     TwoFactorChallengeEntity,
//     TwoFactorEntity,
// } from '../entities/two-factor.entity';
// import { MessageEntity } from '@shared/domain/entities/message.entity';

// export abstract class MyAccountRepository {
//     abstract logout(): Observable<MessageEntity>;

//     abstract updatePassword(payload: PasswordEntity): Observable<MessageEntity>;

//     abstract updateProfile(payload: ProfileEntity): Observable<MessageEntity>;

//     abstract requestTwoFactor(
//         payload: RequestTwoFactorEntity
//     ): Observable<TwoFactorChallengeEntity>;

//     abstract verifyTwoFactorEnable(
//         payload: TwoFactorEntity
//     ): Observable<MessageEntity>;

//     abstract disableTwoFactor(payload: TwoFactorEntity): Observable<MessageEntity>;
// }
