import { Injectable, inject } from '@angular/core';
import { MessageEntity } from '@shared/domain/entities/message.entity';
import { Observable } from 'rxjs';

import { ChangePasswordCommand } from '../commands/change-password.command';
import { DisableTwoFactorCommand } from '../commands/disable-two-factor.command';
import { LogoutCommand } from '../commands/logout.command';
import { RequestTwoFactorCommand } from '../commands/request-two-factor.command';
import { UpdateProfileCommand } from '../commands/update-profile.command';
import { VerifyTwoFactorCommand } from '../commands/verify-two-factor.command';
import { MyAccountHandler } from '../commands-handlers/my-account.handler';
// import { TwoFactorChallengeEntity } from '../../domain/entities/two-factor.entity';

export type MyAccountCommand =
    | ChangePasswordCommand
    | DisableTwoFactorCommand
    | LogoutCommand
    | RequestTwoFactorCommand
    | UpdateProfileCommand
    | VerifyTwoFactorCommand;

@Injectable({ providedIn: 'root' })
export class MyAccountCommandBus {
    private readonly handler = inject(MyAccountHandler);

    dispatch(
        command:
            | ChangePasswordCommand
            | DisableTwoFactorCommand
            | LogoutCommand
            | UpdateProfileCommand
            | VerifyTwoFactorCommand
    ): Observable<MessageEntity>;
    // dispatch(
    //     command: RequestTwoFactorCommand
    // ): Observable<TwoFactorChallengeEntity>;
    dispatch(command: MyAccountCommand): Observable<unknown> {
        if (command instanceof ChangePasswordCommand) {
            return this.handler.changePassword(command);
        }
        if (command instanceof UpdateProfileCommand) {
            return this.handler.updateProfile(command);
        }
        // if (command instanceof RequestTwoFactorCommand) {
        //     return this.handler.requestTwoFactor(command);
        // }
        // if (command instanceof VerifyTwoFactorCommand) {
        //     return this.handler.verifyTwoFactor(command);
        // }
        // if (command instanceof DisableTwoFactorCommand) {
        //     return this.handler.disableTwoFactor(command);
        // }
        if (command instanceof LogoutCommand) {
            return this.handler.logout();
        }

        throw new Error('No handler found for my-account command');
    }
}
