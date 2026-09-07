import { Observable } from 'rxjs';
import { LoginResponseEntity } from '@presentation/pages/authentication/domain/entities/login/login-response.entity';
import { ValidateOtpRequestValidateContract } from '@presentation/pages/authentication/domain/contracts/verify-otp/validate-otp-request.validate-contract';

export abstract class ValidateOtpRepository {
    abstract execute(
        validContract: ValidateOtpRequestValidateContract
    ): Observable<LoginResponseEntity>;
}
