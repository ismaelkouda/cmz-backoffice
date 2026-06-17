import { effect, inject, Injectable, signal } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { ParticipantsFindOneFacade } from '@pages/team-organization/application/services/participants/participants-find-one.facade';
import { FormValidators } from '@pages/team-organization/domain/validators/form-validators';
import { ParticipantsFormControl } from '@presentation/pages/team-organization/presentation/store/participants/participants-form.control';
import { formatPhoneForMask } from '@shared/domain/functions/format-phone-for-mask.function';

@Injectable()
export class ParticipantsFormStore {
    private readonly fb = inject(FormBuilder);
    private readonly facade = inject(ParticipantsFindOneFacade);
    public readonly isEditMode = signal(false);
    private readonly item = this.facade.items;
    public readonly loading = this.facade.loading;
    public readonly form: FormGroup<ParticipantsFormControl> =
        this.createForm();

    private createForm(): FormGroup<ParticipantsFormControl> {
        return this.fb.nonNullable.group<ParticipantsFormControl>({
            firstName: new FormControl('', {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.minLength(FormValidators.FIRST_NAME.MIN),
                    Validators.maxLength(FormValidators.FIRST_NAME.MAX),
                    Validators.pattern(FormValidators.FIRST_NAME.PATTERN),
                ],
            }),
            lastName: new FormControl('', {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.minLength(FormValidators.LAST_NAME.MIN),
                    Validators.maxLength(FormValidators.LAST_NAME.MAX),
                    Validators.pattern(FormValidators.LAST_NAME.PATTERN),
                ],
            }),
            email: new FormControl('', {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.pattern(FormValidators.EMAIL.PATTERN),
                ],
            }),
            phone: new FormControl('', {
                nonNullable: true,
            }),
            // role: new FormControl('', {
            //     nonNullable: true,
            //     validators: [Validators.required],
            // }),
        });
    }

    private readonly patchItemEffect = effect(() => {
        const item = this.item();

        if (!item || Object.keys(item).length === 0) {
            return;
        }
        if (!this.form.pristine) {
            return;
        }

        this.form.patchValue(
            {
                lastName: item.lastName,
                firstName: item.firstName,
                email: item.email,
                phone: formatPhoneForMask(item.phone),
                // role: item.role,
            },
            { emitEvent: false }
        );
    });

    public setMode(uniqId: string | null): void {
        this.isEditMode.set(!!uniqId);

        this.facade.reset();
        this.form.reset();
        if (uniqId) {
            this.facade.read({ uniqId });
        }
    }

    public resetForm(): void {
        this.form.reset();
        this.isEditMode.set(false);
        this.facade.reset();
    }
}
