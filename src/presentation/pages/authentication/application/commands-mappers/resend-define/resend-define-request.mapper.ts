import { ResendDefineRequestCommand } from '@presentation/pages/authentication/application/commands/resend-define/resend-define-request.command';
import { ResendDefineRequestContract } from '@presentation/pages/authentication/domain/contracts/resend-define/resend-define-request.contract';

export function resendDefineRequestCommandMapper(
    command: ResendDefineRequestCommand
): ResendDefineRequestContract {
    return {
        token: command.token,
        email: command.email,
    };
}
