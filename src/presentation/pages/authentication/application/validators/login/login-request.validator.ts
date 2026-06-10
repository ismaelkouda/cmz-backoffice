import { EmailRequiredError } from '@shared/domain/errors/validation/email-required.error';
import { PasswordRequiredError } from '@shared/domain/errors/validation/password-required.error';
import { InvalidEmailError } from '@shared/domain/errors/validation/invalid-email.error';
import { isValidEmail } from '@shared/domain/utils/valid-email.util';
import { LoginRequestDto } from '@presentation/pages/authentication/application/dto/login/login-request.dto';

export function validateLoginRequest(dto: LoginRequestDto): void {
    if (!dto.email?.trim()) {
        throw new EmailRequiredError();
    }
    if (!isValidEmail(dto.email.trim())) {
        throw new InvalidEmailError();
    }
    if (!dto.password) {
        throw new PasswordRequiredError(
            'AUTHENTICATION.FORM.PASSWORD.REQUIRED'
        );
    }
}
