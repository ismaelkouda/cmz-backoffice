// import { startWith } from 'rxjs';
// import { computed, inject } from '@angular/core';
// import { toSignal } from '@angular/core/rxjs-interop';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { TwoFactorFacade } from '../../../application/facade/profile-update.facade';
// import { TwoFactorFormControl } from './profile-update-form.control';
// import { TWO_FACTOR_FORM_KEYS } from '../../constants/profile-update/profile-update-form-keys.constant';
// import { TwoFactorFormValue } from './profile-update-form.value';
// import { getControlError } from '@presentation/pages/authentication/presentation/helpers/authentication-form-errors.helper';
// import { TWO_FACTOR_FORM_ERROR_MESSAGES } from '../../constants/profile-update/profile-update-form-error-messages.constant';

// export class TwoFactorStore {
//     private readonly fb = inject(FormBuilder);
//     private readonly facade = inject(TwoFactorFacade);

//     public readonly loading = this.facade.loading;
//     public readonly error = this.facade.error;
//     public readonly session = this.facade.items;

//     public readonly form: FormGroup<TwoFactorFormControl> =
//         this.fb.nonNullable.group({
//             [TWO_FACTOR_FORM_KEYS.LAST_NAME]: ['', [Validators.required]],
//             [TWO_FACTOR_FORM_KEYS.FIRST_NAME]: ['', [Validators.required]],
//             [TWO_FACTOR_FORM_KEYS.EMAIL]: [
//                 '',
//                 [Validators.required, Validators.email],
//             ],
//             [TWO_FACTOR_FORM_KEYS.PHONE]: [
//                 '',
//                 [Validators.required, Validators.pattern(/^(07|05|03)\d{8}$/)],
//             ],
//         });

//     private readonly status = toSignal(
//         this.form.statusChanges.pipe(startWith(this.form.status)),
//         { initialValue: this.form.status }
//     );
//     public readonly isValid = computed(() => this.status() === 'VALID');

//     private get value(): TwoFactorFormValue {
//         return this.form.getRawValue();
//     }

//     public submit(): void {
//         if (this.form.invalid) {
//             this.form.markAllAsTouched();
//             return;
//         }
//         this.facade.execute(this.value, true);
//     }

//     public isFieldInvalid(field: keyof TwoFactorFormControl): boolean {
//         const control = this.form.controls[field];

//         return control.invalid && control.touched;
//     }

//     public isFieldValid(field: keyof TwoFactorFormControl): boolean {
//         const control = this.form.controls[field];
//         return control.valid && control.touched;
//     }

//     public isFieldTouched(field: keyof TwoFactorFormControl): boolean {
//         const control = this.form.controls[field];
//         return control.touched;
//     }

//     public getFieldError(field: keyof TwoFactorFormControl): string | null {
//         return getControlError(
//             this.form.controls[field],
//             TWO_FACTOR_FORM_ERROR_MESSAGES[field]
//         );
//     }
// }
