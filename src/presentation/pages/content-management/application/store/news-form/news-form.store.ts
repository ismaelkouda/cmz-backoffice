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
import { NewsCategoriesSelectFacade } from '@pages/content-management/application/services/news/news-categories-select.facade';
import { NewsFindOneFacade } from '@pages/content-management/application/services/news/news-find-one.facade';
import { NewsFormControl } from '@pages/content-management/domain/controls/news/news-form.control';
import { FormValidators } from '@pages/content-management/domain/validators/form-validators';
import { NewsSubCategoriesSelectProps } from '@presentation/pages/content-management/domain/interfaces/news/news-sub-categories-select.props.interface';
import { getEnumKeyByValue } from '@shared/components/filter/filter.types';
import { ImageUploadStateService } from '@shared/components/image-upload/domain/services/image-upload-state.service';
import { TypeMedia } from '@shared/domain/enums/type-media.enum';

export type CropperStatus = 'idle' | 'loading' | 'ready' | 'cropping' | 'error';
const VIDEO = getEnumKeyByValue(TypeMedia, TypeMedia.VIDEO) as string;
const IMAGE = getEnumKeyByValue(TypeMedia, TypeMedia.IMAGE) as string;

@Injectable()
export class NewsFormStore {
    private readonly fb = inject(FormBuilder);
    private readonly facade = inject(NewsFindOneFacade);
    private readonly categoriesFacade = inject(NewsCategoriesSelectFacade);
    private readonly imageStore = inject(ImageUploadStateService);

    private readonly isPatching = signal(false);

    readonly form: FormGroup<NewsFormControl> = this.createForm();

    public readonly hashtagsArray = this.form.controls.hashtags;

    readonly typeControl = toSignal(this.form.controls.type.valueChanges, {
        initialValue: this.form.controls.type.value,
    });
    readonly categoryValue = toSignal(
        this.form.controls.category.valueChanges,
        {
            initialValue: this.form.controls.category.value,
        }
    );

    public readonly isEditMode = signal(false);

    public readonly isVideoMode = computed(() => {
        const type = this.typeControl();
        return type === VIDEO;
    });
    public readonly isImageMode = computed(() => {
        const type = this.typeControl();
        return type === IMAGE;
    });

    readonly selectedCategory = computed(() =>
        this.categories().find((r) => r.value === this.categoryValue())
    );

    public readonly hashtagsErrors = computed(() => {
        const errors = this.hashtagsArray.errors;
        if (!errors) {
            return null;
        }

        return {
            minHashtags: errors['minHashtags'],
            maxHashtags: errors['maxHashtags'],
            duplicateHashtags: errors['duplicateHashtags'],
        };
    });

    public readonly hashtagsTouched = computed(
        () => this.hashtagsArray.touched
    );

    private readonly item = this.facade.items;
    public readonly loading = this.facade.loading;
    readonly subCategories = signal<readonly NewsSubCategoriesSelectProps[]>(
        []
    );
    readonly loadingNewsSubCategories = signal<boolean>(false);
    readonly categories = toSignal(this.categoriesFacade.items$, {
        initialValue: [],
    });
    readonly loadingCategories = toSignal(this.categoriesFacade.isLoading$, {
        initialValue: false,
    });

    // private readonly patchItemEffect = effect(() => {
    //     const item = this.item();
    //     if (!item) {
    //         return;
    //     }

    //     this.isPatching.set(true);

    //     // Patch des valeurs simples
    //     this.form.patchValue(
    //         {
    //             type: item.type,
    //             title: item.title,
    //             resume: item.resume,
    //             content: item.content,
    //             image: item.image,
    //             video: item.video,
    //             category: item.category,
    //             subCategory: item.subCategory,
    //         },
    //         { emitEvent: false }
    //     );

    //     // Gestion spéciale pour les hashtags (FormArray)
    //     const hashtagsArray = this.form.controls.hashtags;
    //     hashtagsArray.clear({ emitEvent: false });

    //     if (item.hashtags?.length) {
    //         item.hashtags.forEach((tag: string) => {
    //             hashtagsArray.push(this.fb.control(tag, Validators.required), {
    //                 emitEvent: false,
    //             });
    //         });
    //     }

    //     hashtagsArray.updateValueAndValidity({ emitEvent: false });

    //     queueMicrotask(() => this.isPatching.set(false));
    // });

    private readonly typeMediaEffect = effect(() => {
        if (this.isPatching()) {
            return;
        }
        const type = this.typeControl();
        if (!type) {
            return;
        }
        this.resetMediaFields(type);
        this.updateValidatorsByType(type);
    });

    private readonly categoryEffect = effect(() => {
        if (this.isEditMode() && !this.categoryValue()) {
            return;
        }

        const category = this.selectedCategory();
        this.loadingNewsSubCategories.set(true);
        if (category?.subCategories) {
            this.subCategories.set(category.subCategories);

            this.form.controls.subCategory.enable({ emitEvent: false });
        } else {
            this.subCategories.set([]);
            this.form.controls.subCategory.reset('', { emitEvent: false });
            this.form.controls.subCategory.disable({ emitEvent: false });
        }

        this.form.controls.subCategory.updateValueAndValidity({
            emitEvent: false,
        });

        this.loadingNewsSubCategories.set(false);
    });

    private createForm(): FormGroup<NewsFormControl> {
        return this.fb.nonNullable.group<NewsFormControl>(
            {
                type: new FormControl(IMAGE, {
                    nonNullable: true,
                    validators: [Validators.required],
                }),
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
                video: new FormControl('', {
                    nonNullable: true,
                }),
                category: new FormControl('', {
                    nonNullable: true,
                    validators: [Validators.required],
                }),
                subCategory: new FormControl(
                    { value: '', disabled: true },
                    { nonNullable: true }
                ),
                hashtags: this.fb.array<string>([]),
            },
            { validators: [this.buttonFieldsConsistencyValidator()] }
        );
    }

    private updateValidatorsByType(type: string): void {
        const videoControl = this.form.controls.video;
        const imageControl = this.form.controls.image;
        const isVideo = type === VIDEO;
        const isImage = type === IMAGE;
        if (isVideo) {
            videoControl.setValidators([
                Validators.required,
                Validators.pattern(FormValidators.VIDEO.PATTERNS.GENERIC),
            ]);
        } else {
            videoControl.clearValidators();
        }
        if (isImage) {
            imageControl.setValidators([Validators.required]);
        } else {
            imageControl.clearValidators();
        }
        videoControl.updateValueAndValidity({ emitEvent: false });
        imageControl.updateValueAndValidity({ emitEvent: false });
    }

    private resetMediaFields(type: string | undefined): void {
        if (!type) {
            return;
        }

        const resetMap: Record<string, () => void> = {
            [VIDEO]: () => {
                this.resetImage();
                this.resetImageStore();
            },
            [IMAGE]: () => {
                this.resetVideo();
            },
        };

        const resetAction = resetMap[type];
        if (resetAction) {
            resetAction();
        }
    }

    private resetImageStore(): void {
        this.imageStore.resetImage();
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

    public resetVideo(): void {
        this.form.controls.video.reset('', { emitEvent: false });
    }

    public setEditMode(uniqId: string | null): void {
        this.isEditMode.set(!!uniqId);

        this.facade.reset();
        this.form.reset();
        this.form.controls.subCategory.disable({ emitEvent: false });

        if (uniqId) {
            this.facade.read({ uniqId }, true);
        }

        this.categoriesFacade.readAll();
    }
}
