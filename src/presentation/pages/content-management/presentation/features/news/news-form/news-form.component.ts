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
import { NewsFacade } from '@pages/content-management/application/services/news/news.facade';
import { NewsFormStore } from '@pages/content-management/application/store/news-form/news-form.store';
import { NewsFormHelperService } from '@pages/content-management/domain/services/news/news-form-helper.service';
import { FormValidators } from '@pages/content-management/domain/validators/form-validators';
import { HashtagsInputComponent } from '@pages/content-management/presentation/features/news/hashtags-input/hashtags-input.component';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { enumToFilterOptions } from '@shared/components/filter/filter.types';
import { ImageCropDialogComponent } from '@shared/components/image-crop-dialog/image-crop-dialog.component';
import { ImagePreviewDialogComponent } from '@shared/components/image-preview-dialog/image-preview-dialog.component';
import { ImageUploadStateService } from '@shared/components/image-upload/domain/services/image-upload-state.service';
import { ImageUploadComponent } from '@shared/components/image-upload/image-upload.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { SWEET_ALERT_PARAMS } from '@shared/constants/sweet-alert-params.constant';
import { TypeMedia } from '@shared/domain/enums/type-media.enum';
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
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { map, tap } from 'rxjs';
import SweetAlert from 'sweetalert2';

@Component({
    selector: 'app-news-form',
    templateUrl: './news-form.component.html',
    styleUrls: ['./news-form.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        BreadcrumbComponent,
        PageTitleComponent,
        ImageUploadComponent,
        ImagePreviewDialogComponent,
        ImageCropDialogComponent,
        HashtagsInputComponent,
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
    providers: [
        NewsFormHelperService,
        MessageService,
        NewsFormStore,
        ImageUploadStateService,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsFormComponent {
    public readonly instanceId = signal('NewsFormComponent');
    protected readonly store = inject(NewsFormStore);
    private readonly imageStore = inject(ImageUploadStateService);
    protected readonly imageState = this.imageStore.getStore(this.instanceId());

    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly destroyRef = inject(DestroyRef);
    private readonly translate = inject(TranslateService);
    private readonly submitFacade = inject(NewsFacade);
    private readonly helper = inject(NewsFormHelperService);
    private readonly validation = inject(FormValidationService);

    readonly previewVisible = signal(false);

    public readonly form = this.store.form;
    public readonly loading = this.store.loading;
    public readonly isEditMode = this.store.isEditMode;
    public readonly isVideoMode = this.store.isVideoMode;
    public readonly isImageMode = this.store.isImageMode;

    public readonly loadingSubmit = toSignal(this.submitFacade.isLoading$);

    private readonly currentLang = signal<string>(
        this.translate.getCurrentLang()
    );

    readonly typeOptions = computed(() =>
        enumToFilterOptions(TypeMedia, (key) => this.translate.instant(key))
    );

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

        effect(() => {
            const item = this.store.item();
            if (!item?.image) {
                return;
            }
            this.imageStore.hydrate(this.instanceId(), item.image);
        });
    }

    public getErrorMessage(field: string): string {
        const control = this.form.get(field);
        return this.validation.getErrorMessage(field, control?.errors || null);
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

    public get typeMedia(): typeof TypeMedia {
        return TypeMedia;
    }

    public getContentCharacterCount(): number {
        const content = this.form.get('content')?.value || '';
        return content.replaceAll(/<[^>]*>/g, '').trim().length;
    }

    public isFieldInvalid(fieldName: string): boolean {
        const control = this.form.get(fieldName);
        return !!(control?.invalid && control?.touched);
    }

    public onCropConfirmed(event: Blob): void {
        this.imageStore.confirmCrop(this.instanceId(), event);
        const file = this.imageStore.getCurrentFile(this.instanceId());
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
        this.imageStore.reset(this.instanceId());
    }

    protected onImageLoaded(): void {
        this.imageStore.setLoaded(this.instanceId());
    }

    protected onImageFailed(): void {
        this.imageStore.setFailed(this.instanceId());
    }

    protected onImageRotate(direction: 'left' | 'right'): void {
        this.imageStore.rotateCropper(this.instanceId(), direction);
    }

    protected onImageFlipHorizontal(): void {
        this.imageStore.flipCropperHorizontal(this.instanceId());
    }

    protected onImageFlipVertical(): void {
        this.imageStore.flipCropperVertical(this.instanceId());
    }

    protected onImageResetTransforms(): void {
        this.imageStore.resetCropperTransforms(this.instanceId());
    }

    public closeImagePreview(): void {
        this.previewVisible.set(false);
    }

    navigateToBack(): void {
        this.helper.navigateToNewsList();
    }
}
