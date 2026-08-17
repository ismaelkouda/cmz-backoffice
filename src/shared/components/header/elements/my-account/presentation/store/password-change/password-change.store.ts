// import { startWith } from 'rxjs';
// import { computed, inject } from '@angular/core';
// import { toSignal } from '@angular/core/rxjs-interop';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { PasswordChangeFacade } from '../../../application/facade/password-change.facade';
// import { PasswordChangeFormControl } from './password-change-form.control';
// import { PASSWORD_CHANGE_FORM_KEYS } from '../../constants/password-change/password-change-form-keys.constant';
// import { PasswordChangeFormValue } from './password-change-form.value';
// import { getControlError } from '@presentation/pages/authentication/presentation/helpers/authentication-form-errors.helper';
// import { PASSWORD_CHANGE_FORM_ERROR_MESSAGES } from '../../constants/password-change/password-change-form-error-messages.constant';

// export class PasswordChangeStore {
//     private readonly fb = inject(FormBuilder);
//     private readonly facade = inject(PasswordChangeFacade);

//     public readonly loading = this.facade.loading;
//     public readonly error = this.facade.error;
//     public readonly session = this.facade.items;

//     public readonly form: FormGroup<PasswordChangeFormControl> =
//         this.fb.nonNullable.group({
//             [PASSWORD_CHANGE_FORM_KEYS.OLD_PASSWORD]: [
//                 '',
//                 [Validators.required],
//             ],
//             [PASSWORD_CHANGE_FORM_KEYS.NEW_PASSWORD]: [
//                 '',
//                 [Validators.required],
//             ],
//             [PASSWORD_CHANGE_FORM_KEYS.CONFIRM_NEW_PASSWORD]: [
//                 '',
//                 [Validators.required],
//             ],
//         });

//     private readonly status = toSignal(
//         this.form.statusChanges.pipe(startWith(this.form.status)),
//         { initialValue: this.form.status }
//     );
//     public readonly isValid = computed(() => this.status() === 'VALID');

//     private get value(): PasswordChangeFormValue {
//         return this.form.getRawValue();
//     }

//     public submit(): void {
//         if (this.form.invalid) {
//             this.form.markAllAsTouched();
//             return;
//         }
//         this.facade.execute(this.value, true);
//     }

//     public resetPassword(): void {
//         this.form.controls.confirmNewPassword.setValue('');
//     }

//     public isFieldInvalid(field: keyof PasswordChangeFormControl): boolean {
//         const control = this.form.controls[field];

//         return control.invalid && control.touched;
//     }

//     public isFieldValid(field: keyof PasswordChangeFormControl): boolean {
//         const control = this.form.controls[field];
//         return control.valid && control.touched;
//     }

//     public isFieldTouched(field: keyof PasswordChangeFormControl): boolean {
//         const control = this.form.controls[field];
//         return control.touched;
//     }

//     public getFieldError(
//         field: keyof PasswordChangeFormControl
//     ): string | null {
//         return getControlError(
//             this.form.controls[field],
//             PASSWORD_CHANGE_FORM_ERROR_MESSAGES[field]
//         );
//     }
// }
