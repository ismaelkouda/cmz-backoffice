import { ResendDefineRequestValidateContract } from '@presentation/pages/authentication/domain/contracts/resend-define/resend-define-request.validate-contract';
import { ResendDefineResponseEntity } from '@presentation/pages/authentication/domain/entities/resend-define/resend-define-response.entity';
import { Observable } from 'rxjs';

export abstract class ResendDefineRepository {
    abstract execute(
        validContract: ResendDefineRequestValidateContract
    ): Observable<ResendDefineResponseEntity>;
}
