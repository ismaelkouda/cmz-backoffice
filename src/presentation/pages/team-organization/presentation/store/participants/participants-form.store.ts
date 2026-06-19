import { computed, effect, inject, Injectable, signal } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ParticipantsFindOneFacade } from '@pages/team-organization/application/services/participants/participants-find-one.facade';
import { FormValidators } from '@pages/team-organization/domain/validators/form-validators';
import { ParticipantsFormControl } from '@presentation/pages/team-organization/presentation/store/participants/participants-form.control';
import { enumToFilterOptionsWithValue } from '@shared/components/filter/filter.types';
import { Roles } from '@shared/domain/enums/roles.enum';
import { formatPhoneForMask } from '@shared/domain/functions/format-phone-for-mask.function';
import { TeamsSelectFacade } from '@pages/team-organization/application/services/teams/teams-select.facade';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable()
export class ParticipantsFormStore {
    private readonly translate = inject(TranslateService);
    private readonly fb = inject(FormBuilder);
    private readonly facade = inject(ParticipantsFindOneFacade);
    public readonly teamsSelectFacade = inject(TeamsSelectFacade);
    public readonly isEditMode = signal(false);
    private readonly item = this.facade.items;
    public readonly loading = this.facade.loading;
    public readonly form = this.createForm();
    public readonly rolesOptions = computed(() =>
        enumToFilterOptionsWithValue(Roles, this.t.bind(this))
    );
    readonly teams = toSignal(this.teamsSelectFacade.items$, {
        initialValue: [],
    });
    readonly loadingTeams = toSignal(this.teamsSelectFacade.isLoading$, {
        initialValue: false,
    });

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
            role: new FormControl(undefined, {
                nonNullable: true,
            }),
            team: new FormControl(undefined, {
                nonNullable: true,
            }),
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
                phone: item.phone ? formatPhoneForMask(item.phone) : undefined,
            },
            { emitEvent: false }
        );

        if (item.role) {
            this.form.controls.role.setValue(item.role);
        }
        if (item.team) {
            this.form.controls.team.setValue(item.team);
        }
    });

    private readonly teamFieldsConsistencyValidator = effect(() => {
        this.form.controls.team.valueChanges.subscribe((team) => {
            const roleControl = this.form.controls.role;

            if (team) {
                roleControl.addValidators(Validators.required);
            } else {
                roleControl.removeValidators(Validators.required);
            }

            roleControl.updateValueAndValidity();
        });
    });

    public setMode(uniqId: string | null): void {
        this.isEditMode.set(!!uniqId);
        this.teamsSelectFacade.readAll();
        this.facade.reset();
        this.form.reset();
        if (uniqId) {
            this.facade.read(
                { uniqId },
                {
                    forceRefresh: true,
                }
            );
        }
    }

    public resetForm(): void {
        this.form.reset();
        this.isEditMode.set(false);
        this.facade.reset();
    }
    private t(key: string): string {
        return this.translate.instant(key);
    }
}
