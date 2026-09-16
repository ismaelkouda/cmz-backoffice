import { ResendDefineRequestContract } from '@presentation/pages/authentication/domain/contracts/resend-define/resend-define-request.contract';
import { ResendDefineRequestValidateContract } from '@presentation/pages/authentication/domain/contracts/resend-define/resend-define-request.validate-contract';
import { validateResendDefineRequest } from '@presentation/pages/authentication/domain/validators/resend-define/resend-define-request.validator';

export function resendDefineRequestVo(
    contract: ResendDefineRequestContract
): ResendDefineRequestValidateContract {
    validateResendDefineRequest(contract);
    return {
        token: contract.token.trim(),
        email: contract.email.trim(),
    };
}
