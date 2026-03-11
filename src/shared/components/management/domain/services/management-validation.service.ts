import { Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ManagementFormControl } from '@shared/components/management/domain/controls/management-form-control';

@Injectable({
    providedIn: 'root',
})
export class ManagementValidationService {
    configureFormValidators(
        form: FormGroup<ManagementFormControl>,
        context: 'requests' | 'processing' | 'finalization',
        item: any
    ): void {
        const commentControl = form.get('comment');
        const decisionControl = form.get('decision');
        const reasonControl = form.get('reason');

        commentControl?.clearValidators();
        decisionControl?.clearValidators();
        reasonControl?.clearValidators();

        switch (context) {
            case 'requests':
                if (item?.canBeApproved) {
                    decisionControl?.setValidators([Validators.required]);
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
    }

    private setupConditionalValidation(
        form: FormGroup<ManagementFormControl>
    ): void {
        const decisionControl = form.get('decision');
        const reasonControl = form.get('reason');
        const commentControl = form.get('comment');

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
