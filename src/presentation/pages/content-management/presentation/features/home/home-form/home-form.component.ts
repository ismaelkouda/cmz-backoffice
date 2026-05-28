import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    effect,
    inject,
    Signal,
    signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HomeFacade } from '@pages/content-management/application/services/home/home.facade';
import { HomeFormHelperService } from '@pages/content-management/domain/services/home/home-form-helper.service';
import { FormValidators } from '@pages/content-management/domain/validators/form-validators';
import { HomeFormStore } from '@presentation/pages/content-management/application/store/home/home-form.store';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { enumToFilterOptions } from '@shared/components/filter/filter.types';
import { ImageCropDialogComponent } from '@shared/components/image-crop-dialog/image-crop-dialog.component';
import { ImagePreviewDialogComponent } from '@shared/components/image-preview-dialog/image-preview-dialog.component';
import { ImageUploadStateService } from '@shared/components/image-upload/domain/services/image-upload-state.service';
import { ImageUploadComponent } from '@shared/components/image-upload/image-upload.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { SWEET_ALERT_PARAMS } from '@shared/constants/sweet-alert-params.constant';
import { Platform } from '@shared/domain/enums/platform.enum';
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
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { map, tap } from 'rxjs';
import SweetAlert from 'sweetalert2';

@Component({
    selector: 'app-home-form',
    templateUrl: './home-form.component.html',
    styleUrls: ['./home-form.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
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
        ButtonModule,
        DialogModule,
        TagModule,
        InputNumberModule,
        ToastModule,
        TooltipModule,
    ],
    providers: [HomeFormHelperService, MessageService, HomeFormStore],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeFormComponent {
    protected readonly instanceId = 'home-form-image';
    protected readonly store = inject(HomeFormStore);
    private readonly imageStore = inject(ImageUploadStateService);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly destroyRef = inject(DestroyRef);
    private readonly translate = inject(TranslateService);
    private readonly submitFacade = inject(HomeFacade);
    private readonly helper = inject(HomeFormHelperService);
    private readonly validation = inject(FormValidationService);
    protected readonly loadingSubmit = toSignal(this.submitFacade.isLoading$);
    protected readonly form = this.store.form;
    protected readonly loading = this.store.loading;
    protected readonly isEditMode = this.store.isEditMode;
    protected readonly item = this.store.item;
    protected readonly previewVisible = signal(false);
    protected readonly imageVm = computed(() =>
        this.imageStore.connect(this.instanceId)
    );
    protected readonly cropperState = computed(() =>
        this.imageStore.getStore(this.instanceId)()
    );
    protected readonly imageSignal = toSignal(
        this.form.controls.image.valueChanges,
        {
            initialValue: this.form.controls.image.value,
        }
    );
    protected readonly image = computed((): MediaValue | string | undefined => {
        const formImage = this.imageSignal();
        const item = this.item();

        return formImage ?? item?.image;
    });
    protected readonly hasPhotos = computed((): boolean => {
        return !!this.image();
    });
    protected readonly isIdle = computed(() => !this.imageVm().hasImage());
    protected readonly hasError = computed(() => this.imageVm().hasError());
    protected readonly hasImage = computed(() => this.imageVm().hasImage());
    protected readonly fileName = computed(
        () => this.imageVm().fileName() ?? null
    );
    protected readonly fileSize = computed(
        () => this.imageVm().fileSize() ?? null
    );
    protected readonly previewUrl = computed(() => this.imageVm().previewUrl());
    protected readonly platformOptions = computed(() =>
        enumToFilterOptions(Platform, (key) => this.translate.instant(key))
    );
    private lastSuccess = this.submitFacade.actionSuccess();
    protected readonly uniqId: Signal<string> = toSignal(
        this.activatedRoute.queryParams.pipe(
            map((params) => (params['uniqId'] as string) || ''),
            tap((uniqId) => this.store.setMode(uniqId)),
            takeUntilDestroyed(this.destroyRef)
        ),
        { initialValue: '' }
    );
    private readonly formStateEffect = effect(() => {
        const state = this.submitFacade.actionState();
        if (state === 'loading') {
            this.form.disable({ emitEvent: false });
        } else {
            this.form.enable({ emitEvent: false });
        }
    });
    private readonly successEffect = effect(() => {
        const current = this.submitFacade.actionSuccess();
        if (current === this.lastSuccess) {
            return;
        }

        this.lastSuccess = current;
        this.navigateToBack();
    });
    constructor() {
        this.initializeImageHydration();
    }
    private initializeImageHydration(): void {
        effect(() => {
            const item = this.item();
            const formImage = this.imageSignal();
            const previewUrl = this.imageVm().previewUrl();

            if (previewUrl) {
                return;
            }

            if (formImage?.type === 'remote' && formImage.url) {
                this.imageStore.hydrate(this.instanceId, formImage.url);
                return;
            }

            if (formImage?.type === 'local' && formImage.file) {
                this.imageStore.setPreviewFromFile(
                    this.instanceId,
                    formImage.file
                );
                return;
            }

            if (item?.image) {
                this.imageStore.hydrate(this.instanceId, item.image);
            }
        });
    }

    protected getErrorMessage(field: string): string {
        const control = this.form.get(field);
        return this.validation.getErrorMessage(field, control?.errors || null);
    }

    protected isFieldInvalid(fieldName: string): boolean {
        const control = this.form.get(fieldName);
        return !!(control?.invalid && control?.touched);
    }

    protected get allowedImageTypes(): string {
        return FormValidators.IMAGE.ALLOWED_TYPES.map((t) =>
            t.split('/')[1].toUpperCase()
        ).join(', ');
    }

    protected get allowed(): typeof FormValidators {
        return FormValidators;
    }

    protected getContentCharacterCount(): number {
        const content = this.form.get('content')?.value || '';
        return content.replaceAll(/<[^>]*>/g, '').trim().length;
    }

    protected onSubmit(): void {
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

    protected onCropConfirmed(blob: Blob): void {
        this.imageStore.confirmCrop(this.instanceId, blob);
        const file = this.imageStore.getCurrentFile(this.instanceId);
        if (file) {
            this.store.setImage(file);
        }
    }

    protected openImagePreview(): void {
        if (this.imageVm().hasImage()) {
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

    protected closeImagePreview(): void {
        this.previewVisible.set(false);
    }

    navigateToBack(): void {
        this.helper.navigateToHomeList();
    }
}
