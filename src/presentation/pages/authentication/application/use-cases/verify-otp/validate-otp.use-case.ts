import { inject, Injectable } from '@angular/core';
import { defer, Observable } from 'rxjs';
import { ValidateOtpRepository } from '@presentation/pages/authentication/domain/repositories/verify-otp/validate-otp.repository';
import { ValidateOtpRequestContract } from '@presentation/pages/authentication/domain/contracts/verify-otp/validate-otp-request.contract';
import { validateOtpRequestVo } from '@presentation/pages/authentication/domain/value-objects/verify-otp/validate-otp-request.vo';
import { LoginResponseEntity } from '@presentation/pages/authentication/domain/entities/login/login-response.entity';

@Injectable({ providedIn: 'root' })
export class ValidateOtpUseCase {
    private readonly repository = inject(ValidateOtpRepository);

    execute(
        contract: ValidateOtpRequestContract
    ): Observable<LoginResponseEntity> {
        return defer(() =>
            this.repository.execute(validateOtpRequestVo(contract))
        );
    }
}
