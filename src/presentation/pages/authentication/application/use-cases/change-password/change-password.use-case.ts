import { Injectable, inject } from '@angular/core';
import { ChangePasswordResponseEntity } from '@presentation/pages/authentication/domain/entities/change-password/change-password-response.entity';
import { ChangePasswordRepository } from '@presentation/pages/authentication/domain/repositories/change-password/change-password.repository';
import { changePasswordRequestVo } from '@presentation/pages/authentication/domain/value-objects/change-password/change-password-request.vo';
import { defer, Observable } from 'rxjs';
import { ChangePasswordRequestContract } from '@presentation/pages/authentication/domain/contracts/change-password/change-password-request.contract';

@Injectable({ providedIn: 'root' })
export class ChangePasswordUseCase {
    private readonly repository = inject(ChangePasswordRepository);

    execute(
        contract: ChangePasswordRequestContract
    ): Observable<ChangePasswordResponseEntity> {
        return defer(() =>
            this.repository.execute(changePasswordRequestVo(contract))
        );
    }
}
