import { Injectable, inject } from '@angular/core';
import { ForgotPasswordResponseEntity } from '@presentation/pages/authentication/domain/entities/forgot-password/forgot-password-response.entity';
import { ForgotPasswordRepository } from '@presentation/pages/authentication/domain/repositories/forgot-password/forgot-password.repository';
import { forgotPasswordRequestVo } from '@presentation/pages/authentication/domain/value-objects/forgot-password/forgot-password-request.vo';
import { defer, Observable } from 'rxjs';
import { ForgotPasswordRequestContract } from '@presentation/pages/authentication/domain/contracts/forgot-password/forgot-password-request.contract';

@Injectable({ providedIn: 'root' })
export class ForgotPasswordUseCase {
    private readonly repository = inject(ForgotPasswordRepository);

    execute(
        contract: ForgotPasswordRequestContract
    ): Observable<ForgotPasswordResponseEntity> {
        return defer(() =>
            this.repository.execute(forgotPasswordRequestVo(contract))
        );
    }
}
