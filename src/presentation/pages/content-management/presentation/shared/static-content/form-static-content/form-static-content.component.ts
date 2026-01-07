import { CommonModule } from '@angular/common';
import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    inject,
} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { EditorModule } from 'primeng/editor';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';

@Component({
    selector: 'app-form-static-content',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TranslateModule,
        EditorModule,
        InputTextModule,
        ButtonModule,
        TagModule,
    ],
    template: `
        <div class="card shadow-sm border-0">
            <div class="card-body p-4">
                <form [formGroup]="form" (ngSubmit)="onSubmit()">
                    <fieldset class="fieldset">
                        <legend>
                            <b>{{
                                'CONTENT_MANAGEMENT.STATIC_CONTENT.FORM.INFO'
                                    | translate
                            }}</b>
                        </legend>

                        <div class="row g-3">
                            <div class="col-md-6">
                                <label for="version" class="form-label fw-bold">
                                    {{
                                        'CONTENT_MANAGEMENT.STATIC_CONTENT.FORM.VERSION'
                                            | translate
                                    }}
                                    <span class="text-danger">*</span>
                                </label>
                                <input
                                    pInputText
                                    id="version"
                                    formControlName="version"
                                    class="w-100"
                                    [placeholder]="
                                        'CONTENT_MANAGEMENT.STATIC_CONTENT.FORM.VERSION_PLACEHOLDER'
                                            | translate
                                    "
                                />
                                @if (
                                    form.get('version')?.invalid &&
                                    form.get('version')?.touched
                                ) {
                                    <small class="text-danger d-block mt-1">{{
                                        'VALIDATION.REQUIRED' | translate
                                    }}</small>
                                }
                            </div>

                            @if (isEditMode && currentVersion) {
                                <div class="col-md-6 d-flex align-items-end">
                                    <div>
                                        <small
                                            class="text-muted d-block mb-1"
                                            >{{
                                                'CONTENT_MANAGEMENT.STATIC_CONTENT.FORM.CURRENT_VERSION'
                                                    | translate
                                            }}</small
                                        >
                                        <p-tag
                                            severity="info"
                                            [value]="currentVersion"
                                        ></p-tag>
                                    </div>
                                </div>
                            }

                            <div class="col-12">
                                <label for="content" class="form-label fw-bold">
                                    {{
                                        'CONTENT_MANAGEMENT.STATIC_CONTENT.FORM.CONTENT'
                                            | translate
                                    }}
                                    <span class="text-danger">*</span>
                                </label>
                                <p-editor
                                    formControlName="content"
                                    [style]="{ height: '300px' }"
                                ></p-editor>
                                @if (
                                    form.get('content')?.invalid &&
                                    form.get('content')?.touched
                                ) {
                                    <small class="text-danger d-block mt-1">{{
                                        'VALIDATION.REQUIRED' | translate
                                    }}</small>
                                }
                            </div>
                        </div>
                    </fieldset>

                    <div
                        class="d-flex justify-content-end gap-3 mt-4 pt-3 border-top"
                    >
                        <p-button
                            label="{{ 'COMMON.CANCEL' | translate }}"
                            styleClass="p-button-text p-button-secondary"
                            (click)="onCancel()"
                            type="button"
                        >
                        </p-button>
                        <p-button
                            label="{{ 'COMMON.SAVE' | translate }}"
                            type="submit"
                            [disabled]="form.invalid || form.pristine"
                        >
                        </p-button>
                    </div>
                </form>
            </div>
        </div>
    `,
    styles: [
        `
            .fieldset {
                border: 1px solid #dee2e6;
                border-radius: 8px;
                padding: 1.5rem;
                background: #fff;

                legend {
                    float: none;
                    width: auto;
                    padding: 0 0.5rem;
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #495057;
                    margin-bottom: 0;
                }
            }

            ::ng-deep {
                .p-inputtext {
                    border-radius: 6px;
                }
            }
        `,
    ],
})
export class FormStaticContentComponent implements OnInit {
    @Input() isEditMode = false;
    @Input() initialData?: { version: string; content: string };
    @Input() currentVersion?: string;
    @Output() save = new EventEmitter<{ version: string; content: string }>();
    @Output() cancel = new EventEmitter<void>();

    private readonly fb = inject(FormBuilder);
    public form!: FormGroup;

    ngOnInit(): void {
        this.initForm();
        if (this.initialData) {
            this.form.patchValue(this.initialData);
        }
    }

    private initForm(): void {
        this.form = this.fb.group({
            version: ['', Validators.required],
            content: ['', Validators.required],
        });
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        this.save.emit(this.form.value);
    }

    onCancel(): void {
        this.cancel.emit();
    }
}
