import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ValidateOtpCommand } from '@presentation/pages/authentication/application/commands/verify-otp/validate-otp.command';
import { ValidateOtpUseCase } from '@presentation/pages/authentication/application/use-cases/verify-otp/validate-otp.use-case';
import { validateOtpCommandMapper } from '@presentation/pages/authentication/application/commands-mappers/verify-otp/validate-otp.mapper';
import { LoginResponseEntity } from '@presentation/pages/authentication/domain/entities/login/login-response.entity';

@Injectable({ providedIn: 'root' })
export class ValidateOtpHandler {
    private readonly useCase = inject(ValidateOtpUseCase);

    execute(command: ValidateOtpCommand): Observable<LoginResponseEntity> {
        return this.useCase.execute(validateOtpCommandMapper(command));
    }
}
