import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
    AbstractControl,
    FormGroup,
    FormBuilder,
    FormControl,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { TermsUseFindOneFacade } from '@pages/content-management/application/services/terms-use/terms-use-find-one.facade';
import { TermsUseFormControl } from '@pages/content-management/application/store/terms-use/terms-use-form.control';
// import { FormValidators } from '@pages/content-management/domain/validators/form-validators';

@Injectable()
export class TermsUseFormStore {
    private readonly fb = inject(FormBuilder);
    private readonly facade = inject(TermsUseFindOneFacade);

    readonly form: FormGroup<TermsUseFormControl> = this.createForm();

    readonly versionValue = toSignal(this.form.controls.version.valueChanges, {
        initialValue: this.form.controls.version.value,
    });
    readonly contentValue = toSignal(this.form.controls.content.valueChanges, {
        initialValue: this.form.controls.content.value,
    });

    public readonly isEditMode = signal(false);

    private readonly item = this.facade.items;
    public readonly loading = this.facade.loading;

    public readonly contentCharacterCount = computed(() => {
        const content = this.contentValue() || '';
        return content.replaceAll(/<[^>]*>/g, '').trim().length;
    });

    public readonly versionLength = computed(() => {
        return this.versionValue()?.length || 0;
    });

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
                version: item.version,
                content: item.content,
            },
            { emitEvent: false }
        );
    });

    private createForm(): FormGroup<TermsUseFormControl> {
        return this.fb.nonNullable.group<TermsUseFormControl>({
            version: new FormControl('', {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.pattern(/^\d+(\.\d+){0,2}$/),
                    this.semanticVersionValidator(),
                ],
            }),
            content: new FormControl('', {
                nonNullable: true,
                validators: [
                    Validators.required,
                    // Validators.minLength(FormValidators.CONTENT.MIN),
                    // this.htmlContentMaxLengthValidator(
                    //     FormValidators.CONTENT.STRIP_HTML_MAX
                    // ),
                ],
            }),
        });
    }

    private semanticVersionValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const version = control.value as string;
            if (!version) {
                return null;
            }

            const semanticPattern = /^\d+(\.\d+){0,2}$/;

            if (!semanticPattern.test(version)) {
                return { semanticVersion: true };
            }

            if (version.includes('..') || version.endsWith('.')) {
                return { semanticVersion: true };
            }

            return null;
        };
    }

    private htmlContentMaxLengthValidator(maxLength: number): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) {
                return null;
            }
            const stripped = (control.value as string)
                .replaceAll(/<[^>]*>/g, '')
                .trim();
            if (stripped.length > maxLength) {
                return {
                    htmlMaxLength: {
                        actual: stripped.length,
                        maxAllowed: maxLength,
                    },
                };
            }
            return null;
        };
    }

    public setEditMode(uniqId: string | null): void {
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
