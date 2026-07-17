import { Injectable, inject } from '@angular/core';
import { ResetPasswordResponseEntity } from '@presentation/pages/authentication/domain/entities/reset-password/reset-password-response.entity';
import { ResetPasswordRepository } from '@presentation/pages/authentication/domain/repositories/reset-password/reset-password.repository';
import { resetPasswordRequestVo } from '@presentation/pages/authentication/domain/value-objects/reset-password/reset-password-request.vo';
import { defer, Observable } from 'rxjs';
import { ResetPasswordRequestContract } from '@presentation/pages/authentication/domain/contracts/reset-password/reset-password-request.contract';

@Injectable({ providedIn: 'root' })
export class ResetPasswordUseCase {
    private readonly repository = inject(ResetPasswordRepository);

    execute(
        contract: ResetPasswordRequestContract
    ): Observable<ResetPasswordResponseEntity> {
        return defer(() =>
            this.repository.execute(resetPasswordRequestVo(contract))
        );
    }
}
