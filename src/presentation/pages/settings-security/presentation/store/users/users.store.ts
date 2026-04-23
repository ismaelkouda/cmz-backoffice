import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ProfilesPermissionsSelectFacade } from '@pages/settings-security/application/services/profiles-permissions/profiles-permissions-select.facade';
import { UsersFindOneFacade } from '@pages/settings-security/application/services/users/users-find-one.facade';
import { UsersFormControl } from '@pages/settings-security/domain/controls/users/users-form.control';
import { ProfilesPermissionsSelectEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-select.entity';
import { FormValidators } from '@pages/settings-security/domain/validators/form-validators';
import { enumToFilterOptions } from '@shared/components/filter/filter.types';
import { Roles } from '@shared/domain/enums/roles.enum';
import { formatPhoneForMask } from '@shared/domain/functions/format-phone-for-mask.function';

@Injectable()
export class UsersStore {
    private readonly fb = inject(FormBuilder);
    private readonly facade = inject(UsersFindOneFacade);
    private readonly translate = inject(TranslateService);
    private readonly profilesFacade = inject(ProfilesPermissionsSelectFacade);
    public readonly isEditMode = signal(false);
    private readonly item = this.facade.items;
    public readonly loading = this.facade.loading;

    readonly profiles = toSignal(this.profilesFacade.items$, {
        initialValue: [] as ProfilesPermissionsSelectEntity[],
    });
    readonly loadingProfiles = toSignal(this.profilesFacade.isLoading$, {
        initialValue: false,
    });
    readonly rolesOptions = computed(() =>
        enumToFilterOptions(Roles, (key) => this.translate.instant(key))
    );

    readonly form: FormGroup<UsersFormControl> = this.createForm();

    // private readonly profileValue = toSignal(
    //     this.form.controls.profile.valueChanges,
    //     {
    //         initialValue: this.form.controls.profile.value,
    //     }
    // );

    private createForm(): FormGroup<UsersFormControl> {
        return this.fb.nonNullable.group<UsersFormControl>({
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
                validators: [
                    Validators.required,
                    Validators.minLength(FormValidators.PHONE.MIN),
                    Validators.maxLength(FormValidators.PHONE.MAX),
                    Validators.pattern(FormValidators.PHONE.PATTERN),
                ],
            }),
            profile: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            role: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
        });
    }

    // readonly isRoleRequired = computed(() => {
    //     const profile = this.profileValue();
    //     return (
    //         !!profile &&
    //         !profilesWithoutRole.includes(
    //             profile as (typeof profilesWithoutRole)[number]
    //         )
    //     );
    // });

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
                profile: item.profile,
                role: item.role,
            },
            { emitEvent: true }
        );

        // queueMicrotask(() => {
        //     this.form.controls.role.patchValue(item.role, {
        //         emitEvent: false,
        //     });
        // });
    });

    // private readonly roleValidationEffect = effect(() => {
    //     const roleControl = this.form.controls.role;
    //     const isRequired = this.isRoleRequired();

    //     if (isRequired) {
    //         console.log('isRequired: ', isRequired);
    //         roleControl.enable({ emitEvent: false });
    //         roleControl.setValidators([Validators.required]);
    //     } else {
    //         roleControl.reset('', { emitEvent: false });
    //         roleControl.clearValidators();
    //         roleControl.disable({ emitEvent: false });
    //     }

    //     roleControl.updateValueAndValidity({ emitEvent: false });
    // });

    public setMode(uniqId: string | null): void {
        this.isEditMode.set(!!uniqId);

        this.facade.reset();
        this.form.reset();
        this.profilesFacade.readAll();

        if (uniqId) {
            this.facade.read({ uniqId }, true);
        }
    }

    public resetForm(): void {
        this.form.reset();
        this.isEditMode.set(false);
        this.facade.reset();
    }
}
