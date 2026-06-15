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
import { FormValidators } from '@pages/content-management/domain/validators/form-validators';
import { HomeFormControl } from '@presentation/pages/content-management/application/store/home/home-form.control';
import { getEnumKeyByValue } from '@shared/components/filter/filter.types';
import { PLATFORM_ASPECT_RATIOS } from '@shared/components/image-upload/domain/types/image-upload.types';
import { Platform } from '@shared/domain/enums/platform.enum';
import { MediaValue } from '@shared/domain/types/media.types';

export type CropperStatus = 'idle' | 'loading' | 'ready' | 'cropping' | 'error';
const WEB = getEnumKeyByValue(Platform, Platform.WEB) as Platform;
const PWA = getEnumKeyByValue(Platform, Platform.PWA) as Platform;
const MOBILE = getEnumKeyByValue(Platform, Platform.MOBILE) as Platform;

@Injectable()
export class HomeFormStore {
    private readonly fb = inject(FormBuilder);
    private readonly facade = inject(HomeFindOneFacade);
    public readonly isEditMode = signal(false);
    public readonly item = this.facade.items;
    public readonly loading = this.facade.loading;
    public readonly form: FormGroup<HomeFormControl> = this.createForm();

    private readonly imageError = signal<string | null>(null);
    public readonly imageFile = signal<File | string | null>(null);
    private readonly alreadyPatched = signal(false);

    public readonly selectedPlatforms = computed(
        () => this.form.controls.platforms.value
    );
    public readonly activeCropAspectRatio = computed((): number => {
        const platforms = this.selectedPlatforms();
        if (!platforms?.length) {
            return PLATFORM_ASPECT_RATIOS[WEB];
        }

        const ratios = platforms.map((p) => PLATFORM_ASPECT_RATIOS[p]);
        const allSameRatio = ratios.every((r) => r === ratios[0]);

        if (allSameRatio) {
            return ratios[0];
        }

        if (platforms.includes(MOBILE)) {
            return PLATFORM_ASPECT_RATIOS[MOBILE];
        }
        if (platforms.includes(PWA)) {
            return PLATFORM_ASPECT_RATIOS[PWA];
        }
        return PLATFORM_ASPECT_RATIOS[WEB];
    });

    public readonly hasImage = computed(() => !!this.imageFile());

    private createForm(): FormGroup<HomeFormControl> {
        return this.fb.nonNullable.group<HomeFormControl>(
            {
                title: new FormControl('', {
                    nonNullable: true,
                    validators: [
                        Validators.required,
                        // Validators.minLength(FormValidators.TITLE.MIN),
                        // Validators.maxLength(FormValidators.TITLE.MAX),
                        Validators.pattern(FormValidators.TITLE.PATTERN),
                    ],
                }),
                resume: new FormControl('', {
                    nonNullable: true,
                    validators: [
                        Validators.required,
                        // Validators.minLength(FormValidators.RESUME.MIN),
                        // Validators.maxLength(FormValidators.RESUME.MAX),
                        // Validators.pattern(FormValidators.RESUME.PATTERN),
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
                image: new FormControl<MediaValue | null>(null, {
                    validators: [Validators.required],
                }),
                buttonLabel: new FormControl('', {
                    nonNullable: true,
                    validators: [
                        // Validators.minLength(FormValidators.BUTTON_LABEL.MIN),
                        // Validators.maxLength(FormValidators.BUTTON_LABEL.MAX),
                        Validators.pattern(FormValidators.BUTTON_LABEL.PATTERN),
                    ],
                }),
                buttonUrl: new FormControl('', {
                    nonNullable: true,
                    // validators: [
                    //     // Validators.maxLength(FormValidators.BUTTON_URL.MAX),
                    //     Validators.pattern(FormValidators.BUTTON_URL.PATTERN),
                    // ],
                }),
                platforms: new FormControl([], {
                    nonNullable: true,
                    validators: [Validators.required],
                }),
                startDate: new FormControl<Date | undefined>(undefined, {
                    nonNullable: true,
                    validators: [Validators.required],
                }),
                endDate: new FormControl<Date | undefined>(undefined, {
                    nonNullable: true,
                    validators: [Validators.required],
                }),
            },
            { validators: [this.buttonFieldsConsistencyValidator()] }
        );
    }

    private readonly patchItemEffect = effect(() => {
        const item = this.item();

        if (!item) {
            return;
        }

        if (this.alreadyPatched()) {
            return;
        }

        this.alreadyPatched.set(true);

        this.form.patchValue(
            {
                title: item.title,
                resume: item.resume,
                content: item.content,
                buttonLabel: item.buttonLabel,
                buttonUrl: item.buttonUrl,
                platforms: item.platforms,
                startDate: item.startDate,
                endDate: item.endDate,
            },
            { emitEvent: false }
        );
        if (item.image) {
            this.form.controls.image.setValue(
                {
                    type: 'remote',
                    url: item.image,
                },
                { emitEvent: false }
            );

            this.imageFile.set(item.image);
        } else {
            this.resetImage();
        }
    });

    private async handleExistingImage(url: string): Promise<void> {
        this.imageFile.set(url);

        this.imageError.set(null);
    }

    private buttonFieldsConsistencyValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const label = control.get('buttonLabel')?.value?.trim() as string;
            const url = control.get('buttonUrl')?.value?.trim() as string;

            if (label && !url) {
                return { buttonUrlRequired: true };
            }

            if (url && !label) {
                return { buttonLabelRequired: true };
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

    public getSubmitValue(uniqId?: string): any {
        const raw = this.form.getRawValue();

        const basePayload = {
            ...raw,
            image: this.transformImageForApi(raw.image),
        };

        return uniqId ? { ...basePayload, uniqId } : basePayload;
    }

    private transformImageForApi(
        image: MediaValue | null
    ): string | File | null {
        if (!image) {
            return null;
        }
        return image.type === 'remote' ? image.url : image.file;
    }

    public setMode(uniqId: string | null): void {
        this.isEditMode.set(!!uniqId);
        if (!uniqId) {
            this.form.reset();
            this.facade.reset();
            this.imageError.set(null);
            return;
        }
        this.facade.read({ uniqId });
    }

    public setImage(file: File): void {
        const mediaValue: MediaValue = {
            type: 'local',
            file: file,
        };
        this.imageFile.set(file);
        this.form.controls.image.setValue(mediaValue);
        this.form.controls.image.markAsTouched();
        this.imageError.set(null);
    }

    public resetImage(): void {
        this.imageFile.set(null);
        this.form.controls.image.reset(null);
    }

    public resetForm(): void {
        this.form.reset();
        this.imageFile.set(null);
        this.imageError.set(null);
        this.isEditMode.set(false);
    }
}
