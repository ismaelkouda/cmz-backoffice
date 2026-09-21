import { ChangePasswordRequestValidateContract } from '@presentation/pages/authentication/domain/contracts/change-password/change-password-request.validate-contract';
import { ChangePasswordResponseEntity } from '@presentation/pages/authentication/domain/entities/change-password/change-password-response.entity';
import { Observable } from 'rxjs';

export abstract class ChangePasswordRepository {
    abstract execute(
        validContract: ChangePasswordRequestValidateContract
    ): Observable<ChangePasswordResponseEntity>;
}
