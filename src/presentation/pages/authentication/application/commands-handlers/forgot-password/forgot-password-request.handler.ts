import { Injectable, inject } from '@angular/core';
import { ForgotPasswordResponseEntity } from '@presentation/pages/authentication/domain/entities/forgot-password/forgot-password-response.entity';
import { ForgotPasswordRequestCommand } from '@presentation/pages/authentication/application/commands/forgot-password/forgot-password-request.command';
import { ForgotPasswordUseCase } from '@pages/authentication/application/use-cases/forgot-password/forgot-password.use-case';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ForgotPasswordRequestHandler {
    private readonly useCase = inject(ForgotPasswordUseCase);

    execute(
        command: ForgotPasswordRequestCommand
    ): Observable<ForgotPasswordResponseEntity> {
        return this.useCase.execute({
            email: command.email,
        });
    }
}
