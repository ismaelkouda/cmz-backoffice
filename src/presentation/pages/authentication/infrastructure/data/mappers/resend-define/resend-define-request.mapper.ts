import { ResendDefineRequestValidateContract } from '@presentation/pages/authentication/domain/contracts/resend-define/resend-define-request.validate-contract';
import { ResendDefineRequestApiDto } from '@presentation/pages/authentication/infrastructure/api/dto/resend-define/resend-define-request-api.dto';

export function resendDefineRequestMapper(
    validContract: ResendDefineRequestValidateContract
): ResendDefineRequestApiDto {
    return {
        token: validContract.token,
        email: validContract.email,
    };
}
