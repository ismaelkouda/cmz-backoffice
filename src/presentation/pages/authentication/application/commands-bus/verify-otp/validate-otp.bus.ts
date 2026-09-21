import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginResponseEntity } from '@presentation/pages/authentication/domain/entities/login/login-response.entity';
import { ValidateOtpCommand } from '@presentation/pages/authentication/application/commands/verify-otp/validate-otp.command';
import { ValidateOtpHandler } from '@presentation/pages/authentication/application/commands-handlers/verify-otp/validate-otp.handler';

@Injectable({ providedIn: 'root' })
export class ValidateOtpBus {
    private readonly handler = inject(ValidateOtpHandler);

    dispatch<T>(command: T): Observable<LoginResponseEntity> {
        if (command instanceof ValidateOtpCommand) {
            return this.handler.execute(command);
        }
        throw new Error('No handler found for command');
    }
}
