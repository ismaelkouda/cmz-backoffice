import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { USERS_ROUTE } from '@pages/settings-security/settings-security.routes';
import { SETTINGS_SECURITY_ROUTE } from '@shared/routes/routes';
import { MessageService } from 'primeng/api';
@Injectable({
    providedIn: 'root',
})
export class UsersFormHelperService {
    private readonly router = inject(Router);
    private readonly translate = inject(TranslateService);

    navigateToUsersList(): void {
        this.router.navigate([SETTINGS_SECURITY_ROUTE + '/' + USERS_ROUTE]);
    }

    getSweetAlertTitle(isEditMode: boolean): string {
        return isEditMode
            ? 'SETTINGS_SECURITY.USERS.SWEET_ALERT.TITLE.EDIT'
            : 'SETTINGS_SECURITY.USERS.SWEET_ALERT.TITLE.CREATE';
    }

    getSweetAlertMessage(isEditMode: boolean): string {
        return isEditMode
            ? 'SETTINGS_SECURITY.USERS.SWEET_ALERT.MESSAGE.EDIT'
            : 'SETTINGS_SECURITY.USERS.SWEET_ALERT.MESSAGE.CREATE';
    }

    /**
     * Display submit error message.
     * @param messageService
     * @param operation
     * @param error
     */
    displaySubmitError(
        messageService: MessageService,
        operation: 'CREATE' | 'UPDATE',
        error: Error
    ): void {
        const errorKey =
            operation === 'CREATE'
                ? 'COMMON.CREATE_FAILED'
                : 'COMMON.UPDATE_FAILED';
        console.error(`User ${operation} failed:`, error);
        messageService.add({
            severity: 'error',
            summary: this.translate.instant('COMMON.ERROR'),
            detail: this.translate.instant(errorKey),
            life: 5000,
        });
    }
}
