import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';

@Injectable({
    providedIn: 'root',
})
export class ProfilsHabilitationsFormValidationService {
    private readonly translate = inject(TranslateService);
    getErrorMessage(
        fieldName: string,
        errors: Record<string, unknown> | null
    ): string {
        if (!errors) {
            return '';
        }

        if (errors['minlength']) {
            const error = errors['minlength'] as { requiredLength: number };
            return `${this.translate.instant(
                'SETTINGS_SECURITY.PROFILES_HABILITATIONS.FORM.VALIDATION.MIN_LENGTH'
            )}: ${error.requiredLength}`;
        }

        if (errors['maxlength']) {
            const error = errors['maxlength'] as { requiredLength: number };
            return `${this.translate.instant(
                'SETTINGS_SECURITY.PROFILES_HABILITATIONS.FORM.VALIDATION.MAX_LENGTH'
            )}: ${error.requiredLength}`;
        }

        if (errors['pattern']) {
            return this.translate.instant(
                'SETTINGS_SECURITY.PROFILES_HABILITATIONS.FORM.VALIDATION.INVALID_FORMAT'
            );
        }

        return this.translate.instant(
            'SETTINGS_SECURITY.PROFILES_HABILITATIONS.FORM.VALIDATION.INVALID_INPUT'
        );
    }

    showValidationErrors(
        messageService: MessageService,
        errors: string[]
    ): void {
        if (errors.length > 0) {
            messageService.add({
                severity: 'error',
                summary: this.translate.instant('COMMON.VALIDATION_ERRORS'),
                detail: errors.join(' | '),
                life: 5000,
            });
        }
    }
}
