import { Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ManagementFormControl } from '@shared/components/management/domain/controls/management-form-control';
import { TypeReport } from '@shared/domain/enums/type-report.enum';

@Injectable({
    providedIn: 'root',
})
export class ManagementValidationService {
    configureFormValidators(
        form: FormGroup<ManagementFormControl>,
        context: TypeReport,
        item: any
    ): void {
        const commentControl = form.get('comment');
        const decisionControl = form.get('decision');
        const reasonControl = form.get('reason');
        const approvalTypeControl = form.get('approvalType');
        const callbackTypeControl = form.get('callbackType');

        commentControl?.clearValidators();
        decisionControl?.clearValidators();
        reasonControl?.clearValidators();
        approvalTypeControl?.clearValidators();
        callbackTypeControl?.clearValidators();

        switch (context) {
            case 'requests':
                if (item?.canBeApproved) {
                    decisionControl?.setValidators([Validators.required]);
                    approvalTypeControl?.setValidators([Validators.required]);
                    this.setupConditionalValidation(form);
                }
                break;

            case 'processing':
                if (item?.canBeTreated) {
                    commentControl?.setValidators([Validators.required]);
                }
                break;

            case 'finalization':
                if (item?.canBeFinalized) {
                    commentControl?.setValidators([Validators.required]);
                }
                break;
        }

        commentControl?.updateValueAndValidity();
        decisionControl?.updateValueAndValidity();
        reasonControl?.updateValueAndValidity();
        approvalTypeControl?.updateValueAndValidity();
        callbackTypeControl?.updateValueAndValidity();
    }

    private setupConditionalValidation(
        form: FormGroup<ManagementFormControl>
    ): void {
        const decisionControl = form.get('decision');
        const reasonControl = form.get('reason');
        const commentControl = form.get('comment');
        const approvalTypeControl = form.get('approvalType');
        const callbackTypeControl = form.get('callbackType');

        decisionControl?.valueChanges.subscribe((decision) => {
            if (decision === 'rejected') {
                reasonControl?.setValidators([Validators.required]);
                commentControl?.setValidators([Validators.required]);
            } else {
                reasonControl?.clearValidators();
                commentControl?.clearValidators();
            }
            reasonControl?.updateValueAndValidity();
            commentControl?.updateValueAndValidity();
        });

        approvalTypeControl?.valueChanges.subscribe((approvalType) => {
            if (approvalType === 'callback') {
                callbackTypeControl?.setValidators([Validators.required]);
            } else {
                callbackTypeControl?.clearValidators();
            }
            callbackTypeControl?.updateValueAndValidity();
        });
    }

    isFormValidForContext(
        form: FormGroup<ManagementFormControl>,
        context: 'requests' | 'processing' | 'finalization',
        item: any
    ): boolean {
        if (this.isTakeAction(item)) {
            return true;
        }

        return form.valid;
    }

    isTakeAction(item: any): boolean {
        return item?.canBeTaken || false;
    }
}
