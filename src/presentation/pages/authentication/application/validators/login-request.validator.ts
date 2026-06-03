import { EmailRequiredError } from '@shared/domain/errors/validation/email-required.error';
import { InvalidEmailError } from '@shared/domain/errors/validation/invalid-email.error';
import { isValidEmail } from '@shared/domain/utils/valid-email.util';

export function validateLoginRequest(email: string | null | undefined): void {
    if (!email?.trim()) {
        throw new EmailRequiredError();
    }
    if (!isValidEmail(email.trim())) {
        throw new InvalidEmailError();
    }
}
