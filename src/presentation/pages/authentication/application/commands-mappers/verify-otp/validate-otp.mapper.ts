import { ValidateOtpCommand } from '@presentation/pages/authentication/application/commands/verify-otp/validate-otp.command';
import { ValidateOtpRequestContract } from '@presentation/pages/authentication/domain/contracts/verify-otp/validate-otp-request.contract';

export function validateOtpCommandMapper(
    command: ValidateOtpCommand
): ValidateOtpRequestContract {
    return { email: command.email, otp: command.otp };
}
