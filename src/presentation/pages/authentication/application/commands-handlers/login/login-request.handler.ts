import { loginRequestCommandMapper } from '@presentation/pages/authentication/application/commands-mappers/login/login-request.mapper';
import { Injectable, inject } from '@angular/core';
import { LoginResponseEntity } from '@presentation/pages/authentication/domain/entities/login/login-response.entity';
import { LoginRequestCommand } from '@presentation/pages/authentication/application/commands/login/login-request.command';
import { LoginUseCase } from '@presentation/pages/authentication/application/use-cases/login/login.use-case';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoginRequestHandler {
    private readonly useCase = inject(LoginUseCase);

    execute(command: LoginRequestCommand): Observable<LoginResponseEntity> {
        return this.useCase.execute(loginRequestCommandMapper(command));
    }
}
