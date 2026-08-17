import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SWEET_ALERT_PARAMS } from '@shared/constants/sweet-alert-params.constant';
import SweetAlert from 'sweetalert2';

export interface SweetAlertConfig {
    titleKey: string;
    messageKey: string;
    titleParams?: Record<string, string>;
    messageParams?: Record<string, string>;
    confirmTextKey?: string;
    cancelTextKey?: string;
    showCancel?: boolean;
}

@Injectable({ providedIn: 'root' })
export class SweetAlertService {
    private readonly translate = inject(TranslateService);

    async confirm(config: SweetAlertConfig): Promise<boolean> {
        const result = await SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.formatMessage(config.titleKey, config.titleParams),
            html: this.formatMessage(config.messageKey, config.messageParams),
            confirmButtonText: this.translate.instant(
                config.confirmTextKey ?? 'COMMON.CONFIRM'
            ),
            cancelButtonText: this.translate.instant(
                config.cancelTextKey ?? 'COMMON.CANCEL'
            ),
            showCancelButton: config.showCancel ?? true,
        });

        return result.isConfirmed;
    }

    private formatMessage(
        key: string,
        params?: Record<string, string>
    ): string {
        let message = this.translate.instant(key);
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                message = message.replaceAll(key, value);
            });
        }
        return message;
    }
}
