import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
    FormGroup,
    FormBuilder,
    FormControl,
    Validators,
} from '@angular/forms';
import { RegionsSelectFacade } from '@pages/administrative-boundary/application/services/regions/regions-select.facade';
import { getEnumKeyByValue } from '@shared/components/filter/filter.types';
import { ChatbotFindOneFacade } from '@shared/components/management/application/services/chatbot/chatbot-find-one.facade';
import { ChatbotFormControl } from '@shared/components/management/domain/controls/messaging/chatbot-form.control';
import { Target } from '@shared/components/management/domain/enums/chatbot/chatbot-target.enum';
import { FormValidators } from '@shared/components/management/domain/validators/form-validators';

@Injectable()
export class ChatbotFormStore {
    private readonly fb = inject(FormBuilder);
    private readonly facade = inject(ChatbotFindOneFacade);
    private readonly regionsFacade = inject(RegionsSelectFacade);

    private readonly item = this.facade.items;
    private readonly isPatching = signal(false);

    readonly selectedRegionCode = computed(() => this.formValue().region);

    readonly selectedDepartmentCode = computed(
        () => this.formValue().department
    );
    readonly currentTargetType = computed(() => this.formValue().targetType);

    readonly form = this.createForm();

    readonly formValue = toSignal(this.form.valueChanges, {
        initialValue: this.form.getRawValue(),
    });

    readonly regions = toSignal(this.regionsFacade.items$, {
        initialValue: [],
    });

    readonly departments = computed(() => {
        const regionCode = this.selectedRegionCode();
        if (!regionCode) {
            return [];
        }
        return (
            this.regions().find((r) => r.value === regionCode)?.departments ||
            []
        );
    });

    readonly municipalities = computed(() => {
        const departmentCode = this.selectedDepartmentCode();
        if (!departmentCode) {
            return [];
        }
        const region = this.regions().find((r) =>
            r.departments?.some((d) => d.value === departmentCode)
        );
        return (
            region?.departments?.find((d) => d.value === departmentCode)
                ?.municipalities || []
        );
    });

    private readonly regionEffect = effect(() => {
        const region = this.selectedRegionCode();
        if (this.isPatching()) {
            return;
        }
        if (!region) {
            return;
        }
        if (this.form.controls.department.value) {
            return;
        }
        this.form.patchValue(
            {
                department: '',
                municipality: '',
            },
            { emitEvent: false }
        );

        this.updateDependentValidators();
    });

    private readonly departmentEffect = effect(() => {
        const department = this.selectedDepartmentCode();
        if (this.isPatching()) {
            return;
        }
        if (!department) {
            return;
        }
        if (this.form.controls.municipality.value) {
            return;
        }
        this.form.patchValue(
            {
                municipality: '',
            },
            { emitEvent: false }
        );
        this.updateDependentValidators();
    });

    private readonly targetTypeEffect = effect(() => {
        const targetType = this.currentTargetType();
        if (this.isPatching()) {
            return;
        }
        if (!targetType) {
            return;
        }
        const isReport =
            targetType === getEnumKeyByValue(Target, Target.report);
        if (isReport) {
            this.form.patchValue(
                {
                    region: '',
                    department: '',
                    municipality: '',
                },
                { emitEvent: false }
            );
        } else {
            this.form.patchValue(
                {
                    reportId: '',
                },
                { emitEvent: false }
            );
        }
        this.updateValidatorsForTargetType(targetType);
    });

    readonly isReportMode = computed(() => {
        const targetType = this.currentTargetType();
        return targetType === getEnumKeyByValue(Target, Target.report);
    });

    readonly isDetailsMode = signal(false);
    readonly loading = this.facade.loading;
    readonly loadingRegions = toSignal(this.regionsFacade.isLoading$, {
        initialValue: false,
    });

    private readonly setupItemPatch = effect(() => {
        const item = this.item();
        this.isPatching.set(true);
        if (item) {
            this.form.patchValue({
                reportId: item.reportId || '',
                type: item.type,
                targetType: item.targetType,
                region: item.region,
                department: item.department,
                municipality: item.municipality,
                channels: item.channels,
                subject: item.subject,
                content: item.content,
            });
            this.isPatching.set(false);
        }
    });

    private createForm(): FormGroup<ChatbotFormControl> {
        return this.fb.nonNullable.group<ChatbotFormControl>({
            reportId: new FormControl('', {
                nonNullable: true,
            }),
            type: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            targetType: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            region: new FormControl('', { nonNullable: true }),
            department: new FormControl('', { nonNullable: true }),
            municipality: new FormControl('', { nonNullable: true }),
            channels: new FormControl([], {
                nonNullable: true,
                validators: [Validators.required],
            }),
            subject: new FormControl('', {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.minLength(FormValidators.SUBJECT.MIN),
                    Validators.maxLength(FormValidators.SUBJECT.MAX),
                    Validators.pattern(FormValidators.SUBJECT.PATTERN),
                ],
            }),
            content: new FormControl('', {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.minLength(FormValidators.CONTENT.MIN),
                    Validators.maxLength(FormValidators.CONTENT.MAX),
                    Validators.pattern(FormValidators.CONTENT.PATTERN),
                ],
            }),
        });
    }

    private updateValidatorsForTargetType(targetType: string | null): void {
        const isReport =
            targetType === getEnumKeyByValue(Target, Target.report);

        const reportIdControl = this.form.controls.reportId;
        if (isReport) {
            reportIdControl.setValidators([
                Validators.required,
                Validators.minLength(FormValidators.REPORT_ID.MIN),
                Validators.maxLength(FormValidators.REPORT_ID.MAX),
                Validators.pattern(FormValidators.REPORT_ID.PATTERN),
            ]);
        }
        reportIdControl.updateValueAndValidity({ emitEvent: false });
    }

    private updateDependentValidators(): void {
        const isReport = this.isReportMode();
        if (isReport) {
            return;
        }
        const regionValue = this.form.controls.region.value;
        const departmentControl = this.form.controls.department;
        if (regionValue) {
            departmentControl.setValidators([Validators.required]);
        } else {
            departmentControl.clearValidators();
        }
        departmentControl.updateValueAndValidity({ emitEvent: false });

        const departmentValue = this.form.controls.department.value;
        const municipalityControl = this.form.controls.municipality;

        if (departmentValue) {
            municipalityControl.setValidators([Validators.required]);
        } else {
            municipalityControl.clearValidators();
        }
        municipalityControl.updateValueAndValidity({ emitEvent: false });
    }

    private clearFieldsForTargetType(targetType: string | null): void {
        const isReport =
            targetType === getEnumKeyByValue(Target, Target.report);

        if (isReport) {
            this.form.controls.region.setValue('', { emitEvent: false });
            this.form.controls.department.setValue('', { emitEvent: false });
            this.form.controls.municipality.setValue('', { emitEvent: false });
        } else {
            this.form.controls.reportId.setValue('', { emitEvent: false });
        }
    }

    public setDetailsMode(uniqId: string | null): void {
        this.isDetailsMode.set(!!uniqId);
        if (uniqId) {
            this.facade.read({ uniqId }, true);
        } else {
            this.form.reset();
            this.facade.reset();
        }
        this.regionsFacade.readAll(true);
    }
}
