import { Injectable, inject } from '@angular/core';
import { LoginResponseEntity } from '@presentation/pages/authentication/domain/entities/login/login-response.entity';
import { LoginRepository } from '@presentation/pages/authentication/domain/repositories/login/login.repository';
import { loginRequestVo } from '@presentation/pages/authentication/domain/value-objects/login/login-request.vo';
import { defer, Observable } from 'rxjs';
import { LoginRequestContract } from '@presentation/pages/authentication/domain/contracts/login/login-request.contract';

@Injectable({ providedIn: 'root' })
export class LoginUseCase {
    private readonly repository = inject(LoginRepository);

    execute(contract: LoginRequestContract): Observable<LoginResponseEntity> {
        return defer(() => this.repository.execute(loginRequestVo(contract)));
    }
}
