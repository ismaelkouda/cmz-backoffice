import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    Input,
    OnChanges,
    OnInit,
    Output,
    EventEmitter,
    SimpleChanges,
} from '@angular/core';
import {
    ReactiveFormsModule,
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DialogModule } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';
import { SlaVmProps } from '@pages/sla/presentation/adapters/sla/sla-vm-props.interface';
import { SweetAlertService } from '@shared/domain/services/sweet-alert.service';

export type SlaFormMode = 'create' | 'edit' | 'view';

@Component({
    selector: 'app-sla-form',
    standalone: true,
    templateUrl: './sla-form.component.html',
    styleUrls: ['./sla-form.component.scss'],
    imports: [
        DialogModule,
        ReactiveFormsModule,
        TranslateModule,
        ButtonModule,
        InputTextModule,
        TextareaModule,
        MessageModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlaFormComponent implements OnInit, OnChanges {
    @Input() visible = false;
    @Input() mode: SlaFormMode = 'create';
    @Input() item: SlaVmProps | null = null;

    @Output() closed = new EventEmitter<void>();
    @Output() saved = new EventEmitter<{ name: string; description: string }>();

    private readonly fb = inject(FormBuilder);
    private readonly translate = inject(TranslateService);
    private readonly sweetAlert = inject(SweetAlertService);

    protected readonly form: FormGroup = this.fb.group({
        name: ['', [Validators.required, Validators.maxLength(255)]],
        description: ['', [Validators.maxLength(1000)]],
    });

    protected readonly isViewMode = computed(() => this.mode === 'view');
    protected readonly isEditMode = computed(() => this.mode === 'edit');
    protected readonly isCreateMode = computed(() => this.mode === 'create');
    protected readonly dialogHeader = computed(() => {
        if (this.isViewMode()) {
            return this.t('SLA.SLA_FORM.VIEW_TITLE');
        }
        if (this.isEditMode()) {
            return this.t('SLA.SLA_FORM.EDIT_TITLE');
        }
        return this.t('SLA.SLA_FORM.CREATE_TITLE');
    });

    ngOnInit(): void {
        this.syncForm();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['visible'] || changes['mode'] || changes['item']) {
            this.syncForm();
        }
    }

    private syncForm(): void {
        this.form.enable({ emitEvent: false });
        if (this.item && (this.isEditMode() || this.isViewMode())) {
            this.form.reset(
                {
                    name: this.item.name ?? '',
                    description: this.item.description ?? '',
                },
                { emitEvent: false }
            );

            if (this.isViewMode()) {
                this.form.disable({ emitEvent: false });
            }
        } else {
            this.form.reset(
                {
                    name: '',
                    description: '',
                },
                { emitEvent: false }
            );
        }

        this.form.markAsPristine();
        this.form.markAsUntouched();
    }

    protected async onSubmit(): Promise<void> {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const confirmed = await this.sweetAlert.confirm({
            titleKey: this.isEditMode()
                ? 'SLA.SLA_FORM.SWEET_ALERT.TITLE.EDIT'
                : 'SLA.SLA_FORM.SWEET_ALERT.TITLE.CREATE',
            messageKey: this.isEditMode()
                ? 'SLA.SLA_FORM.SWEET_ALERT.MESSAGE.EDIT'
                : 'SLA.SLA_FORM.SWEET_ALERT.MESSAGE.CREATE',
            messageParams: { name: String(this.form.get('name')?.value ?? '') },
        });

        if (!confirmed) {
            return;
        }

        this.saved.emit(this.form.getRawValue());
    }

    protected onCancel(): void {
        this.form.reset(
            {
                name: '',
                description: '',
            },
            { emitEvent: false }
        );
        this.closed.emit();
    }

    protected onDialogHide(): void {
        this.closed.emit();
    }

    protected getErrorMessage(fieldName: string): string {
        const control = this.form.get(fieldName);
        if (!control || !control.errors) {
            return '';
        }

        if (control.errors['required']) {
            return this.t('COMMON.VALIDATION.REQUIRED');
        }
        if (control.errors['maxlength']) {
            return this.t('COMMON.VALIDATION.MAX_LENGTH', {
                max: control.errors['maxlength'].requiredLength,
            });
        }
        return this.t('COMMON.VALIDATION.INVALID_INPUT');
    }

    private t(key: string, params?: Record<string, unknown>): string {
        return this.translate.instant(key, params);
    }
}
