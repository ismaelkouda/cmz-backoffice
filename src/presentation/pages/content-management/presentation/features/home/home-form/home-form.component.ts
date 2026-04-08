import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    inject,
    Signal,
    signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HomeFacade } from '@pages/content-management/application/services/home/home.facade';
import { HomeFormStore } from '@pages/content-management/application/store/home-form/home-form.store';
import { HomeFormHelperService } from '@pages/content-management/domain/services/home/home-form-helper.service';
import { FormValidators } from '@pages/content-management/domain/validators/form-validators';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { enumToFilterOptions } from '@shared/components/filter/filter.types';
import { ImageCropDialogComponent } from '@shared/components/image-crop-dialog/image-crop-dialog.component';
import { ImagePreviewData } from '@shared/components/image-preview-dialog/domain/types/image-preview.types';
import { ImagePreviewDialogComponent } from '@shared/components/image-preview-dialog/image-preview-dialog.component';
import { ImageUploadStateService } from '@shared/components/image-upload/domain/services/image-upload-state.service';
import { ImageSelectedResult } from '@shared/components/image-upload/domain/types/image-upload.types';
import { ImageUploadComponent } from '@shared/components/image-upload/image-upload.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { SWEET_ALERT_PARAMS } from '@shared/constants/sweet-alert-params.constant';
import { Platform } from '@shared/domain/enums/platform.enum';
import { FormValidationService } from '@shared/domain/services/form-validation.service';
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
    providers: [
        HomeFormHelperService,
        MessageService,
        HomeFormStore,
        ImageUploadStateService,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeFormComponent {
    readonly store = inject(HomeFormStore);
    readonly imageStore = inject(ImageUploadStateService);

    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly destroyRef = inject(DestroyRef);
    private readonly translate = inject(TranslateService);
    private readonly submitFacade = inject(HomeFacade);
    private readonly helper = inject(HomeFormHelperService);
    private readonly validation = inject(FormValidationService);

    readonly previewVisible = signal(false);

    public readonly form = this.store.form;
    public readonly loading = this.store.loading;
    public readonly isEditMode = this.store.isEditMode;
    public readonly cropperSourceFile = this.imageStore.cropperSourceFile;

    public readonly loadingSubmit = toSignal(this.submitFacade.isLoading$);

    private readonly currentLang = signal<string>(
        this.translate.getCurrentLang()
    );

    readonly platformOptions = computed(() =>
        enumToFilterOptions(Platform, (key) => this.translate.instant(key))
    );

    readonly previewImageData = computed<ImagePreviewData>(() => {
        const previewUrl = this.imageStore.cropperPreviewUrl();
        const mediaValue = this.form.controls.image.value;

        let fileName: string | null = null;
        let fileSize: number | undefined = undefined;

        if (mediaValue?.type === 'local' && mediaValue.file) {
            fileName = mediaValue.file.name;
            fileSize = mediaValue.file.size;
        } else if (mediaValue?.type === 'remote' && mediaValue.url) {
            fileName = mediaValue.url.split('/').pop() || 'image.jpg';
        }

        return {
            url: previewUrl || '',
            fileName,
            fileSize: this.formatFileSize(fileSize),
            alt: this.translate.instant('CONTENT_MANAGEMENT.HOME.FORM.IMAGE'),
        };
    });

    private readonly uniqId: Signal<string> = toSignal(
        this.activatedRoute.queryParams.pipe(
            map(
                (params: Record<string, unknown>) =>
                    (params['uniqId'] as string) || ''
            ),
            tap((uniqId) => this.store.setEditMode(uniqId)),
            takeUntilDestroyed(this.destroyRef)
        ),
        { initialValue: '' }
    );

    constructor() {
        this.translate.onLangChange
            .pipe(takeUntilDestroyed())
            .subscribe((lang) => this.currentLang.set(lang.lang));
    }

    public getErrorMessage(field: string): string {
        const control = this.form.get(field);
        return this.validation.getErrorMessage(field, control?.errors || null);
    }

    public onCropImageLoadFailed(): void {
        this.imageStore.onCropperImageLoadFailed();
    }

    private formatFileSize(size?: number): string | null {
        if (!size) {
            return null;
        }

        return size < 1024 * 1024
            ? `${(size / 1024).toFixed(0)} Ko`
            : `${(size / (1024 * 1024)).toFixed(1)} Mo`;
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

    public isFieldInvalid(fieldName: string): boolean {
        const control = this.form.get(fieldName);
        return !!(control?.invalid && control?.touched);
    }

    public onImageSelected({ file }: ImageSelectedResult): void {
        this.store.onImageSelected(file);
    }

    public onCropConfirmed(blob: Blob): void {
        this.store.onCropConfirmed(blob);
    }

    public onCropCancelled(): void {
        this.store.onCropCancelled();
    }

    public onImageCleared(): void {
        this.store.onImageCleared();
    }

    public openImagePreview(): void {
        if (this.store.isImageAvailable()) {
            this.previewVisible.set(true);
        }
    }

    public closeImagePreview(): void {
        this.previewVisible.set(false);
    }

    navigateToBack(): void {
        this.helper.navigateToHomeList();
    }
}
