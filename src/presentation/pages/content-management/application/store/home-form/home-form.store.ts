import { Injectable, inject, signal, computed, effect } from '@angular/core';
import {
    AbstractControl,
    FormGroup,
    FormBuilder,
    FormControl,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { HomeFindOneFacade } from '@pages/content-management/application/services/home/home-find-one.facade';
import { HomeFormControl } from '@pages/content-management/domain/controls/home/home-form.control';
import { FormValidators } from '@pages/content-management/domain/validators/form-validators';
import { PLATFORM_ASPECT_RATIOS } from '@shared/components/image-upload/domain/types/image-upload.types';
import { Platform } from '@shared/domain/enums/platform.enum';

export type CropperStatus = 'idle' | 'loading' | 'ready' | 'cropping' | 'error';

@Injectable()
export class HomeFormStore {
    private readonly fb = inject(FormBuilder);
    private readonly facade = inject(HomeFindOneFacade);

    private readonly isPatching = signal(false);

    readonly form: FormGroup<HomeFormControl> = this.createForm();

    public readonly isEditMode = signal(false);

    public readonly selectedPlatforms = computed(
        () => this.form.controls.platforms.value
    );
    public readonly activeCropAspectRatio = computed((): number => {
        const platforms = this.selectedPlatforms();
        if (!platforms?.length) {
            return PLATFORM_ASPECT_RATIOS[Platform.WEB];
        }

        const ratios = platforms.map((p) => PLATFORM_ASPECT_RATIOS[p]);
        const allSameRatio = ratios.every((r) => r === ratios[0]);

        if (allSameRatio) {
            return ratios[0];
        }

        if (platforms.includes(Platform.MOBILE)) {
            return PLATFORM_ASPECT_RATIOS[Platform.MOBILE];
        }
        if (platforms.includes(Platform.PWA)) {
            return PLATFORM_ASPECT_RATIOS[Platform.PWA];
        }
        return PLATFORM_ASPECT_RATIOS[Platform.WEB];
    });

    private readonly item = this.facade.items;
    public readonly loading = this.facade.loading;

    private readonly patchItemEffect = effect(() => {
        const item = this.item();
        if (!item) {
            return;
        }
        this.isPatching.set(true);
        this.form.patchValue({ ...item });
        queueMicrotask(() => this.isPatching.set(false));
    });

    private createForm(): FormGroup<HomeFormControl> {
        return this.fb.nonNullable.group<HomeFormControl>(
            {
                title: new FormControl('', {
                    nonNullable: true,
                    validators: [
                        Validators.required,
                        Validators.minLength(FormValidators.TITLE.MIN),
                        Validators.maxLength(FormValidators.TITLE.MAX),
                        Validators.pattern(FormValidators.TITLE.PATTERN),
                    ],
                }),
                resume: new FormControl('', {
                    nonNullable: true,
                    validators: [
                        Validators.required,
                        Validators.minLength(FormValidators.RESUME.MIN),
                        Validators.maxLength(FormValidators.RESUME.MAX),
                        Validators.pattern(FormValidators.RESUME.PATTERN),
                    ],
                }),

                content: new FormControl('', {
                    nonNullable: true,
                    validators: [
                        Validators.required,
                        Validators.minLength(FormValidators.CONTENT.MIN),
                        this.htmlContentMaxLengthValidator(
                            FormValidators.CONTENT.STRIP_HTML_MAX
                        ),
                    ],
                }),

                image: new FormControl(null, {
                    nonNullable: true,
                    validators: [Validators.required],
                }),

                buttonLabel: new FormControl('', {
                    nonNullable: true,
                    validators: [
                        Validators.required,
                        Validators.minLength(FormValidators.BUTTON_LABEL.MIN),
                        Validators.maxLength(FormValidators.BUTTON_LABEL.MAX),
                        Validators.pattern(FormValidators.BUTTON_LABEL.PATTERN),
                    ],
                }),

                buttonUrl: new FormControl('', {
                    nonNullable: true,
                    validators: [
                        Validators.required,
                        Validators.maxLength(FormValidators.BUTTON_URL.MAX),
                        Validators.pattern(FormValidators.BUTTON_URL.PATTERN),
                    ],
                }),

                platforms: new FormControl([], {
                    nonNullable: true,
                    validators: [Validators.required],
                }),

                startDate: new FormControl('', {
                    nonNullable: true,
                }),

                endDate: new FormControl('', {
                    nonNullable: true,
                }),
            },
            { validators: [this.buttonFieldsConsistencyValidator()] }
        );
    }

    private buttonFieldsConsistencyValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const label = control.get('buttonLabel')?.value?.trim() as string;
            const url = control.get('buttonUrl')?.value?.trim() as string;
            if (label && !url) {
                return { buttonLabelWithoutUrl: true };
            }
            if (url && !label) {
                return { buttonUrlWithoutLabel: true };
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

    public resetImage(): void {
        this.form.controls.image.reset(null, { emitEvent: false });
    }

    public setEditMode(uniqId: string | null): void {
        this.isEditMode.set(!!uniqId);

        if (!uniqId) {
            this.form.reset();
            this.facade.reset();
            return;
        }

        this.facade.read({ uniqId }, true);
    }
}
