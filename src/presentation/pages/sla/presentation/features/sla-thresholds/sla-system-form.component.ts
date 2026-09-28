import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    computed,
    inject,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SweetAlertService } from '@shared/domain/services/sweet-alert.service';

export type SlaSystemFormMode = 'create' | 'edit';

export interface SlaSystemFormItem {
    id: number;
    name: string;
    description: string;
}

@Component({
    selector: 'app-sla-system-form',
    standalone: true,
    imports: [
        DialogModule,
        ReactiveFormsModule,
        TranslateModule,
        ButtonModule,
        InputTextModule,
        TextareaModule,
    ],
    template: `
        <p-dialog
            [visible]="visible"
            [modal]="true"
            [style]="{ width: '600px' }"
            [draggable]="false"
            [resizable]="false"
            [header]="dialogHeader()"
            (visibleChange)="onDialogHide()"
        >
            <form [formGroup]="form" (ngSubmit)="submit()" class="sla-form">
                <div class="field">
                    <label for="systemName">
                        {{ 'SLA.SLA_FORM.NAME' | translate }}
                        <span class="text-danger">*</span>
                    </label>
                    <input
                        pInputText
                        id="systemName"
                        formControlName="name"
                        [placeholder]="
                            'SLA.SLA_FORM.NAME_PLACEHOLDER' | translate
                        "
                        class="w-full"
                    />
                    @if (
                        form.controls.name.invalid && form.controls.name.touched
                    ) {
                        <small class="text-danger d-block mt-1">
                            {{ 'COMMON.VALIDATION.REQUIRED' | translate }}
                        </small>
                    }
                </div>

                <div class="field">
                    <label for="systemDescription">
                        {{ 'SLA.SLA_FORM.DESCRIPTION' | translate }}
                    </label>
                    <textarea
                        pInputTextarea
                        id="systemDescription"
                        formControlName="description"
                        [placeholder]="
                            'SLA.SLA_FORM.DESCRIPTION_PLACEHOLDER' | translate
                        "
                        rows="4"
                        class="w-100"
                    ></textarea>
                </div>
            </form>

            <ng-template pTemplate="footer">
                <p-button
                    [label]="'COMMON.CANCEL' | translate"
                    icon="pi pi-times"
                    styleClass="p-button-danger"
                    (onClick)="cancel()"
                />
                <p-button
                    [label]="'COMMON.SAVE' | translate"
                    icon="pi pi-check"
                    [disabled]="form.invalid"
                    (onClick)="submit()"
                />
            </ng-template>
        </p-dialog>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlaSystemFormComponent implements OnChanges {
    @Input() visible = false;
    @Input() mode: SlaSystemFormMode = 'create';
    @Input() item: SlaSystemFormItem | null = null;
    @Output() closed = new EventEmitter<void>();
    @Output() saved = new EventEmitter<{
        name: string;
        description: string;
    }>();

    private readonly fb = inject(FormBuilder);
    private readonly translate = inject(TranslateService);
    private readonly sweetAlert = inject(SweetAlertService);

    readonly form = this.fb.group({
        name: ['', [Validators.required, Validators.maxLength(255)]],
        description: ['', [Validators.maxLength(1000)]],
    });
    readonly dialogHeader = computed(() =>
        this.translate.instant(
            this.mode === 'edit'
                ? 'SLA.SLA_FORM.EDIT_TITLE'
                : 'SLA.SLA_FORM.CREATE_TITLE'
        )
    );

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['visible'] || changes['mode'] || changes['item']) {
            this.form.reset(
                this.mode === 'edit' && this.item
                    ? {
                          name: this.item.name,
                          description: this.item.description,
                      }
                    : { name: '', description: '' },
                { emitEvent: false }
            );
            this.form.markAsUntouched();
        }
    }

    async submit(): Promise<void> {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const confirmed = await this.sweetAlert.confirm({
            titleKey:
                this.mode === 'edit'
                    ? 'SLA.SLA_FORM.SWEET_ALERT.TITLE.EDIT'
                    : 'SLA.SLA_FORM.SWEET_ALERT.TITLE.CREATE',
            messageKey:
                this.mode === 'edit'
                    ? 'SLA.SLA_FORM.SWEET_ALERT.MESSAGE.EDIT'
                    : 'SLA.SLA_FORM.SWEET_ALERT.MESSAGE.CREATE',
            messageParams: { name: this.form.controls.name.value ?? '' },
        });

        if (confirmed) {
            this.saved.emit(
                this.form.getRawValue() as {
                    name: string;
                    description: string;
                }
            );
        }
    }

    cancel(): void {
        this.closed.emit();
    }

    onDialogHide(): void {
        this.closed.emit();
    }
}
