import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';

/**
 * Validation service for Users form.
 * Provides centralized error message handling and validation error display.
 * Follows the same pattern as ProfilsHabilitationsFormValidationService.
 */
@Injectable({
    providedIn: 'root',
})
export class ParticipantsFormValidationService {
    private readonly translate = inject(TranslateService);

    /**
     * Generate human-readable error message based on validation error type.
     * @param fieldName - Name of the field with error
     * @param errors - Validation errors object
     * @returns Translated error message
     */
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
                'COMMON.VALIDATION.MIN_LENGTH'
            )}: ${error.requiredLength}`;
        }

        if (errors['maxlength']) {
            const error = errors['maxlength'] as { requiredLength: number };
            return `${this.translate.instant(
                'COMMON.VALIDATION.MAX_LENGTH'
            )}: ${error.requiredLength}`;
        }

        if (errors['pattern']) {
            return this.translate.instant('COMMON.VALIDATION.INVALID_FORMAT');
        }

        if (errors['required']) {
            return this.translate.instant('COMMON.VALIDATION.REQUIRED');
        }

        return this.translate.instant('COMMON.VALIDATION.INVALID_INPUT');
    }

    /**
     * Display validation errors in a toast message.
     * @param messageService - PrimeNG MessageService instance
     * @param errors - Array of error messages to display
     */
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
