// import { Injectable, inject, signal } from '@angular/core';
// import { ApiError } from '@shared/domain/errors/api.error';
// import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
// import { Observable, catchError, finalize, throwError } from 'rxjs';

// import { MyAccountResultEntity } from '../domain/entities/my-account-result.entity';
// import { TwoFactorChallengeEntity } from '../domain/entities/two-factor.entity';
// import { ChangePasswordCommand } from './commands/change-password.command';
// import { DisableTwoFactorCommand } from './commands/disable-two-factor.command';
// import { LogoutCommand } from './commands/logout.command';
// import { RequestTwoFactorCommand } from './commands/request-two-factor.command';
// import { UpdateProfileCommand } from './commands/update-profile.command';
// import { VerifyTwoFactorCommand } from './commands/verify-two-factor.command';
// import { MyAccountCommandBus } from './commands-bus/my-account-command.bus';
// import { ChangePasswordDto } from './dto/password-change.dto';
// import { TwoFactorVerifyDto } from './dto/two-factor.dto';
// import { UpdateProfileDto } from './dto/profile-update.dto';
// import { RequestTwoFactorDto } from './dto/two-factor-request.dto';
// import { RequestTwoFactorEntity } from '../domain/entities/two-factor-request.entity';

// @Injectable({ providedIn: 'root' })
// export class MyAccountFacade {
//     private readonly commandBus = inject(MyAccountCommandBus);
//     private readonly feedback = inject(UiFeedbackService);

//     private readonly _loading = signal(false);
//     readonly loading = this._loading.asReadonly();

//     private readonly _twoFactorChallenge =
//         signal<TwoFactorChallengeEntity | null>(null);
//     readonly twoFactorChallenge = this._twoFactorChallenge.asReadonly();

//     updateProfile(
//         payload: UpdateProfileDto
//     ): Observable<MyAccountResultEntity> {
//         const command = new UpdateProfileCommand(
//             payload.id,
//             payload.lastName,
//             payload.firstName,
//             payload.email,
//             payload.phone
//         );
//         return this.run(this.commandBus.dispatch(command));
//     }

//     updatePassword(
//         payload: ChangePasswordDto
//     ): Observable<MyAccountResultEntity> {
//         const command = new ChangePasswordCommand(
//             payload.oldPassword,
//             payload.newPassword,
//             payload.newPasswordConfirmation
//         );
//         return this.run(this.commandBus.dispatch(command));
//     }

//     requestTwoFactor(
//         payload: RequestTwoFactorDto
//     ): Observable<RequestTwoFactorEntity> {
//         const command = new RequestTwoFactorCommand(
//             payload.userId,
//             payload.email
//         );
//         return this.run(this.commandBus.dispatch(command));
//     }

//     verifyTwoFactor(
//         payload: TwoFactorVerifyDto
//     ): Observable<MyAccountResultEntity> {
//         const command = new VerifyTwoFactorCommand(
//             payload.userId,
//             payload.email,
//             payload.code
//         );
//         return this.run(this.commandBus.dispatch(command));
//     }

//     disableTwoFactor(
//         payload: TwoFactorRequestDto
//     ): Observable<MyAccountResultEntity> {
//         const command = new DisableTwoFactorCommand(
//             payload.userId,
//             payload.email
//         );
//         return this.run(this.commandBus.dispatch(command));
//     }

//     logout(): Observable<MyAccountResultEntity> {
//         return this.run(this.commandBus.dispatch(new LogoutCommand()));
//     }

//     setTwoFactorChallenge(value: TwoFactorChallengeEntity | null): void {
//         this._twoFactorChallenge.set(value);
//     }

//     private run<T>(source$: Observable<T>): Observable<T> {
//         if (this._loading()) {
//             return throwError(() => new Error('MY_ACCOUNT.ERROR.IN_PROGRESS'));
//         }

//         this._loading.set(true);
//         return source$.pipe(
//             catchError((error: unknown) => {
//                 this.feedback.error(this.toMessageKey(error));
//                 return throwError(() => error);
//             }),
//             finalize(() => this._loading.set(false))
//         );
//     }

//     private toMessageKey(error: unknown): string {
//         if (error instanceof ApiError || error instanceof Error) {
//             return error.message;
//         }

//         return 'COMMON.ERROR.UNKNOWN';
//     }
// }
