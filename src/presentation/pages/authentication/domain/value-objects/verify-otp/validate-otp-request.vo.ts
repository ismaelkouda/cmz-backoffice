import { ValidateOtpRequestContract } from '@presentation/pages/authentication/domain/contracts/verify-otp/validate-otp-request.contract';
import { ValidateOtpRequestValidateContract } from '@presentation/pages/authentication/domain/contracts/verify-otp/validate-otp-request.validate-contract';

export function validateOtpRequestVo(
    contract: ValidateOtpRequestContract
): ValidateOtpRequestValidateContract {
    const email = contract.email?.trim() ?? '';
    const otp = contract.otp?.trim() ?? '';
    return { email, otp };
}
