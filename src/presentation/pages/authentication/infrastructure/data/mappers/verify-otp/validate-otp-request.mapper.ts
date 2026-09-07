import { ValidateOtpRequestValidateContract } from '@presentation/pages/authentication/domain/contracts/verify-otp/validate-otp-request.validate-contract';
import { ValidateOtpApiDto } from '@presentation/pages/authentication/infrastructure/api/dto/verify-otp/validate-otp-api.dto';

export function validateOtpRequestMapper(
    validContract: ValidateOtpRequestValidateContract
): ValidateOtpApiDto {
    return {
        email: validContract.email,
        otp: validContract.otp,
    };
}
