// import { startWith } from 'rxjs';
// import { computed, inject } from '@angular/core';
// import { toSignal } from '@angular/core/rxjs-interop';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { ProfileUpdateFacade } from '../../../application/facade/profile-update.facade';
// import { ProfileUpdateFormControl } from './profile-update-form.control';
// import { PROFILE_UPDATE_FORM_KEYS } from '../../constants/profile-update/profile-update-form-keys.constant';
// import { ProfileUpdateFormValue } from './profile-update-form.value';
// import { getControlError } from '@presentation/pages/authentication/presentation/helpers/authentication-form-errors.helper';
// import { PROFILE_UPDATE_FORM_ERROR_MESSAGES } from '../../constants/profile-update/profile-update-form-error-messages.constant';

// export class ProfileUpdateStore {
//     private readonly fb = inject(FormBuilder);
//     private readonly facade = inject(ProfileUpdateFacade);

//     public readonly loading = this.facade.loading;
//     public readonly error = this.facade.error;
//     public readonly session = this.facade.items;

//     public readonly form: FormGroup<ProfileUpdateFormControl> =
//         this.fb.nonNullable.group({
//             [PROFILE_UPDATE_FORM_KEYS.LAST_NAME]: ['', [Validators.required]],
//             [PROFILE_UPDATE_FORM_KEYS.FIRST_NAME]: ['', [Validators.required]],
//             [PROFILE_UPDATE_FORM_KEYS.EMAIL]: [
//                 '',
//                 [Validators.required, Validators.email],
//             ],
//             [PROFILE_UPDATE_FORM_KEYS.PHONE]: [
//                 '',
//                 [Validators.required, Validators.pattern(/^(07|05|03)\d{8}$/)],
//             ],
//         });

//     private readonly status = toSignal(
//         this.form.statusChanges.pipe(startWith(this.form.status)),
//         { initialValue: this.form.status }
//     );
//     public readonly isValid = computed(() => this.status() === 'VALID');

//     private get value(): ProfileUpdateFormValue {
//         return this.form.getRawValue();
//     }

//     public submit(): void {
//         if (this.form.invalid) {
//             this.form.markAllAsTouched();
//             return;
//         }
//         this.facade.execute(this.value, true);
//     }

//     public isFieldInvalid(field: keyof ProfileUpdateFormControl): boolean {
//         const control = this.form.controls[field];

//         return control.invalid && control.touched;
//     }

//     public isFieldValid(field: keyof ProfileUpdateFormControl): boolean {
//         const control = this.form.controls[field];
//         return control.valid && control.touched;
//     }

//     public isFieldTouched(field: keyof ProfileUpdateFormControl): boolean {
//         const control = this.form.controls[field];
//         return control.touched;
//     }

//     public getFieldError(field: keyof ProfileUpdateFormControl): string | null {
//         return getControlError(
//             this.form.controls[field],
//             PROFILE_UPDATE_FORM_ERROR_MESSAGES[field]
//         );
//     }
// }
