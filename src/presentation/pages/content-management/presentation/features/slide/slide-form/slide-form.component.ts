import {
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    effect,
    inject,
    Signal,
    signal,
    untracked,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SlideFacade } from '@pages/content-management/application/services/slide/slide.facade';
import { SlideFormStore } from '@pages/content-management/application/store/slide/slide-form.store';
import { SlideFormHelperService } from '@pages/content-management/domain/services/slide/slide-form-helper.service';
import { FormValidators } from '@pages/content-management/domain/validators/form-validators';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { enumToFilterOptions } from '@shared/components/filter/filter.types';
import { ImageCropDialogComponent } from '@shared/components/image-crop-dialog/image-crop-dialog.component';
import { ImagePreviewDialogComponent } from '@shared/components/image-preview-dialog/image-preview-dialog.component';
import { ImageUploadStateService } from '@shared/components/image-upload/domain/services/image-upload-state.service';
import { ImageUploadComponent } from '@shared/components/image-upload/image-upload.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { SWEET_ALERT_PARAMS } from '@shared/constants/sweet-alert-params.constant';
import { Platform } from '@shared/domain/enums/platform.enum';
import { TypeMedia } from '@shared/domain/enums/type-media.enum';
import { FormValidationService } from '@shared/domain/services/form-validation.service';
import { MediaValue } from '@shared/domain/types/media.types';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { EditorModule } from 'primeng/editor';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { map, tap } from 'rxjs';
import SweetAlert from 'sweetalert2';

@Component({
    selector: 'app-slide-form',
    templateUrl: './slide-form.component.html',
    styleUrls: ['./slide-form.component.scss'],
    standalone: true,
    imports: [
        TranslateModule,
        BreadcrumbComponent,
        PageTitleComponent,
        ImageUploadComponent,
        ImagePreviewDialogComponent,
        ImageCropDialogComponent,
        ReactiveFormsModule,
        EditorModule,
        FileUploadModule,
        DatePickerModule,
        InputTextModule,
        TextareaModule,
        MultiSelectModule,
        SelectModule,
        ButtonModule,
        DialogModule,
        TagModule,
        InputNumberModule,
        ToastModule,
        TooltipModule,
    ],
    providers: [SlideFormHelperService, MessageService, SlideFormStore],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlideFormComponent {
    public readonly instanceId = 'slide-form-image';

    protected readonly store = inject(SlideFormStore);
    private readonly imageStore = inject(ImageUploadStateService);

    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly destroyRef = inject(DestroyRef);
    private readonly translate = inject(TranslateService);
    private readonly submitFacade = inject(SlideFacade);
    private readonly helper = inject(SlideFormHelperService);
    private readonly validation = inject(FormValidationService);

    public readonly loadingSubmit = toSignal(this.submitFacade.isLoading$);

    public readonly form = this.store.form;
    public readonly loading = this.store.loading;
    public readonly isEditMode = this.store.isEditMode;
    public readonly item = this.store.item;
    public readonly isVideoMode = this.store.isVideoMode;
    public readonly isImageMode = this.store.isImageMode;

    readonly previewVisible = signal(false);

    readonly imageVm = computed(() => this.imageStore.connect(this.instanceId));

    readonly cropperState = computed(() =>
        this.imageStore.getStore(this.instanceId)()
    );

    readonly imageSignal = toSignal(this.form.controls.image.valueChanges, {
        initialValue: this.form.controls.image.value,
    });

    readonly image = computed((): MediaValue | string | undefined => {
        const formImage = this.imageSignal();
        const item = this.item();

        return formImage ?? item?.image;
    });

    protected readonly hasPhotos = computed((): boolean => {
        return !!this.image();
    });

    readonly isIdle = computed(() => !this.imageVm().hasImage());
    readonly hasError = computed(() => this.imageVm().hasError());
    readonly hasImage = computed(() => this.imageVm().hasImage());
    readonly fileName = computed(() => this.imageVm().fileName() ?? null);
    readonly fileSize = computed(() => this.imageVm().fileSize() ?? null);
    readonly previewUrl = computed(() => this.imageVm().previewUrl());

    private readonly currentLang = signal(this.translate.getCurrentLang());

    readonly typeOptions = computed(() =>
        enumToFilterOptions(TypeMedia, (key) => this.translate.instant(key))
    );

    readonly platformOptions = computed(() =>
        enumToFilterOptions(Platform, (key) => this.translate.instant(key))
    );

    readonly uniqId: Signal<string> = toSignal(
        this.activatedRoute.queryParams.pipe(
            map((params) => (params['uniqId'] as string) || ''),
            tap((uniqId) => this.store.setEditMode(uniqId)),
            takeUntilDestroyed(this.destroyRef)
        ),
        { initialValue: '' }
    );

    private previousDetailsType = false;
    private lastSuccess = this.submitFacade.actionSuccess();

    constructor() {
        this.initializeLanguageListener();
        this.initializeImageHydration();
    }

    private readonly successEffect = effect(() => {
        const current = this.submitFacade.actionSuccess();
        if (current === this.lastSuccess) {
            return;
        }

        this.lastSuccess = current;
        this.navigateToBack();
    });

    private resetImage(): void {
        effect(() => {
            const current = this.store.isImageMode();

            if (current && !this.previousDetailsType) {
                untracked(() => {
                    this.onImageCleared();
                });
            }

            this.previousDetailsType = current;
        });
    }

    private initializeLanguageListener(): void {
        this.translate.onLangChange
            .pipe(takeUntilDestroyed())
            .subscribe((lang) => {
                this.currentLang.set(lang.lang);
            });
    }

    private readonly hydratedUrl = signal<string | null>(null);

    private initializeImageHydration(): void {
        effect(() => {
            const item = this.item();
            const formImage = this.imageSignal();

            if (formImage?.type === 'local' && formImage.file) {
                const previewUrl = this.imageVm().previewUrl();
                if (!previewUrl) {
                    this.imageStore.setPreviewFromFile(
                        this.instanceId,
                        formImage.file
                    );
                }
                return;
            }

            const remoteUrl =
                formImage?.type === 'remote'
                    ? formImage.url
                    : (item?.image ?? null);

            if (!remoteUrl) {
                return;
            }
            if (this.hydratedUrl() === remoteUrl) {
                return;
            }

            this.hydratedUrl.set(remoteUrl);
            this.imageStore.hydrate(this.instanceId, remoteUrl);
        });
    }

    public getErrorMessage(field: string): string {
        const control = this.form.get(field);
        return this.validation.getErrorMessage(field, control?.errors || null);
    }

    public isFieldInvalid(fieldName: string): boolean {
        const control = this.form.get(fieldName);
        return !!(control?.invalid && control?.touched);
    }

    public get allowedImageTypes(): string {
        return FormValidators.IMAGE.ALLOWED_TYPES.map((t) =>
            t.split('/')[1].toUpperCase()
        ).join(', ');
    }

    public get allowed(): typeof FormValidators {
        return FormValidators;
    }

    public getContentCharacterCount(): number {
        const content = this.form.get('content')?.value || '';
        return content.replaceAll(/<[^>]*>/g, '').trim().length;
    }

    public get typeMedia(): typeof TypeMedia {
        return TypeMedia;
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const title = this.helper.getSweetAlertTitle(this.isEditMode());
        const message = this.helper.getSweetAlertMessage(this.isEditMode());

        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.translate.instant(title),
            text: this.translate.instant(message),
        }).then((result) => {
            if (!result.isConfirmed) {
                return;
            }

            if (this.isEditMode()) {
                const payload = this.store.getSubmitValue(this.uniqId());
                this.submitFacade.update(payload);
            } else {
                const payload = this.store.getSubmitValue();
                this.submitFacade.create(payload);
            }
        });
    }

    public onCropConfirmed(event: Blob): void {
        this.imageStore.confirmCrop(this.instanceId, event);
        const file = this.imageStore.getCurrentFile(this.instanceId);
        if (file) {
            this.store.setImage(file);
        }
    }

    protected openImagePreview(): void {
        if (this.store.hasImage()) {
            this.previewVisible.set(true);
        }
    }

    protected onImageCleared(): void {
        this.store.resetImage();
        this.imageStore.reset(this.instanceId);
    }

    protected onImageLoaded(): void {
        this.imageStore.setLoaded(this.instanceId);
    }

    protected onImageFailed(): void {
        this.imageStore.setFailed(this.instanceId);
    }

    protected onImageRotate(direction: 'left' | 'right'): void {
        this.imageStore.rotateCropper(this.instanceId, direction);
    }

    protected onImageFlipHorizontal(): void {
        this.imageStore.flipCropperHorizontal(this.instanceId);
    }

    protected onImageFlipVertical(): void {
        this.imageStore.flipCropperVertical(this.instanceId);
    }

    protected onImageResetTransforms(): void {
        this.imageStore.resetCropperTransforms(this.instanceId);
    }

    public closeImagePreview(): void {
        this.previewVisible.set(false);
    }

    navigateToBack(): void {
        this.helper.navigateToSlideList();
    }
}
