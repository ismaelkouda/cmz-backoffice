// import { Injectable, inject } from '@angular/core';
// import { Observable } from 'rxjs';
// import { MessageEntity } from '@shared/domain/entities/message.entity';

// import { ChangePasswordCommand } from '../commands/change-password.command';
// import { DisableTwoFactorCommand } from '../commands/disable-two-factor.command';
// import { RequestTwoFactorCommand } from '../commands/request-two-factor.command';
// import { UpdateProfileCommand } from '../commands/update-profile.command';
// import { VerifyTwoFactorCommand } from '../commands/verify-two-factor.command';
// import { MyAccountUseCase } from '../use-cases/my-account.use-case';
// import { TwoFactorChallengeEntity } from '../../domain/entities/two-factor.entity';

// @Injectable({ providedIn: 'root' })
// export class MyAccountHandler {
//     private readonly useCase = inject(MyAccountUseCase);

//     updateProfile(command: UpdateProfileCommand): Observable<MessageEntity> {
//         return this.useCase.updateProfile({
//             id: command.id,
//             lastName: command.lastName,
//             firstName: command.firstName,
//             email: command.email,
//             phone: command.phone,
//         });
//     }

//     changePassword(
//         command: ChangePasswordCommand
//     ): Observable<MessageEntity> {
//         return this.useCase.updatePassword({
//             oldPassword: command.oldPassword,
//             newPassword: command.newPassword,
//             newPasswordConfirmation: command.newPasswordConfirmation,
//         });
//     }

//     requestTwoFactor(
//         command: RequestTwoFactorCommand
//     ): Observable<TwoFactorChallengeEntity> {
//         return this.useCase.requestTwoFactor({
//             userId: command.userId,
//             email: command.email,
//         });
//     }

//     verifyTwoFactor(
//         command: VerifyTwoFactorCommand
//     ): Observable<MessageEntity> {
//         return this.useCase.verifyTwoFactorEnable({
//             userId: command.userId,
//             email: command.email,
//             code: command.code,
//         });
//     }

//     disableTwoFactor(
//         command: DisableTwoFactorCommand
//     ): Observable<MessageEntity> {
//         return this.useCase.disableTwoFactor({
//             userId: command.userId,
//             email: command.email,
//         });
//     }

//     logout(): Observable<MessageEntity> {
//         return this.useCase.logout();
//     }
// }
