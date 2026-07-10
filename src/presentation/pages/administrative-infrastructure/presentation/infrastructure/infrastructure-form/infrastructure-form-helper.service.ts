import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ADMINISTRATIVE_INFRASTRUCTURE_ROUTE } from '@shared/routes/routes';
import { MessageService } from 'primeng/api';
import { INFRASTRUCTURE_ROUTE } from '@pages/administrative-infrastructure/presentation/infrastructure/infrastructure-paths.constants';
@Injectable({
    providedIn: 'root',
})
export class InfrastructureFormHelperService {
    private readonly router = inject(Router);
    private readonly translate = inject(TranslateService);

    navigateToInfrastructureList(): void {
        this.router.navigate([
            ADMINISTRATIVE_INFRASTRUCTURE_ROUTE + '/' + INFRASTRUCTURE_ROUTE,
        ]);
    }

    getSweetAlertTitle(isEditMode: boolean): string {
        return isEditMode
            ? 'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE.SWEET_ALERT.TITLE.EDIT'
            : 'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE.SWEET_ALERT.TITLE.CREATE';
    }

    getSweetAlertMessage(isEditMode: boolean): string {
        return isEditMode
            ? 'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE.SWEET_ALERT.MESSAGE.EDIT'
            : 'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE.SWEET_ALERT.MESSAGE.CREATE';
    }

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
