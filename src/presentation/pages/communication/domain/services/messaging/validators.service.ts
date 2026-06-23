import { Injectable } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MessagingTargetEnum } from '@pages/communication/domain/enums/messaging/messaging-target.enum';
import { FormValidators } from '@pages/communication/domain/validators/form-validators';

@Injectable({ providedIn: 'root' })
export class ValidatorsService {
    private readonly baseValidators = {
        reportId: [
            Validators.required,
            Validators.minLength(FormValidators.REPORT_ID.MIN),
            Validators.maxLength(FormValidators.REPORT_ID.MAX),
            Validators.pattern(FormValidators.REPORT_ID.PATTERN),
        ],
        region: [Validators.required],
    } as const;

    getValidatorsForTarget(
        targetType: string | null,
        field: 'reportId' | 'region'
    ): any {
        const isReport = targetType === MessagingTargetEnum.REPORT;

        if (field === 'reportId') {
            return isReport ? this.baseValidators.reportId : [];
        }

        return !isReport ? this.baseValidators.region : [];
    }

    updateControlValidators(
        control: FormControl,
        targetType: string | null,
        field: 'reportId' | 'region'
    ): void {
        const validators = this.getValidatorsForTarget(targetType, field);
        control.clearValidators();

        if (validators.length > 0) {
            control.setValidators(validators);
        }

        control.updateValueAndValidity({ emitEvent: false });
    }
}
