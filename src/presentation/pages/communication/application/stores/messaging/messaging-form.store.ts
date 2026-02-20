import {
    Injectable,
    inject,
    signal,
    computed,
    effect,
    DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
    FormGroup,
    FormBuilder,
    FormControl,
    Validators,
} from '@angular/forms';
import { tap } from 'rxjs/operators';

import { getEnumKeyByValue } from '@shared/components/filter/filter.types';

import { RegionsSelectFacade } from '@presentation/pages/administrative-boundary/core/application/services/regions/regions-select.facade';
import { MessagingFindOneFacade } from '@presentation/pages/communication/application/services/messaging/messaging-find-one.facade';
import { MessagingFormControl } from '@presentation/pages/communication/domain/controls/messaging/messaging-form.control';
import { Target } from '@presentation/pages/communication/domain/enums/messaging/messaging-target.enum';
import { FormValidators } from '@presentation/pages/communication/domain/validators/form-validators';

@Injectable()
export class MessagingFormStore {
    private readonly destroyRef = inject(DestroyRef);
    private readonly fb = inject(FormBuilder);
    private readonly facade = inject(MessagingFindOneFacade);
    private readonly regionsFacade = inject(RegionsSelectFacade);

    private readonly item = this.facade.items;
    private readonly itemPatched = signal(false);
    private readonly selectedRegionCode = signal<string | null>(null);
    private readonly selectedDepartmentCode = signal<string | null>(null);
    private readonly currentTargetType = signal<string | null>(null);

    readonly form = this.createForm();

    readonly regions = toSignal(this.regionsFacade.items$, {
        initialValue: [],
    });

    readonly departments = computed(() => {
        const regionCode = this.selectedRegionCode();
        if (!regionCode) {
            return [];
        }

        const region = this.regions().find((r) => r.code === regionCode);
        return region?.departments || [];
    });

    readonly municipalities = computed(() => {
        const departmentCode = this.selectedDepartmentCode();
        if (!departmentCode) {
            return [];
        }

        const region = this.regions().find((r) =>
            r.departments?.some((d) => d.code === departmentCode)
        );
        return (
            region?.departments?.find((d) => d.code === departmentCode)
                ?.municipalities || []
        );
    });

    readonly isEditMode = signal(false);
    readonly loading = this.facade.loading;
    readonly isReportMode = computed(() => {
        const targetType = this.currentTargetType();
        return targetType === getEnumKeyByValue(Target, Target.report);
    });

    constructor() {
        this.setupFormSubscriptions();
        this.setupItemPatch();
    }

    private createForm(): FormGroup<MessagingFormControl> {
        return this.fb.nonNullable.group<MessagingFormControl>({
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

    private setupFormSubscriptions(): void {
        this.form.controls.targetType.valueChanges
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                tap((targetType) => {
                    this.currentTargetType.set(targetType);

                    this.updateValidatorsForTargetType(targetType);

                    this.clearFieldsForTargetType(targetType);
                })
            )
            .subscribe();

        this.form.controls.region.valueChanges
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                tap((code) => {
                    this.selectedRegionCode.set(code);
                    this.form.controls.department.setValue('', {
                        emitEvent: false,
                    });
                    this.form.controls.municipality.setValue('', {
                        emitEvent: false,
                    });
                    this.selectedDepartmentCode.set(null);
                    /* this.updateDependentValidators(); */
                })
            )
            .subscribe();

        this.form.controls.department.valueChanges
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                tap((code) => {
                    this.selectedDepartmentCode.set(code);

                    this.form.controls.municipality.setValue('', {
                        emitEvent: false,
                    });

                    /* this.updateDependentValidators(); */
                })
            )
            .subscribe();

        this.form.controls.targetType.valueChanges
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                tap((targetType) => {
                    this.currentTargetType.set(targetType);

                    if (
                        targetType === getEnumKeyByValue(Target, Target.report)
                    ) {
                        this.form.controls.region.setValue('', {
                            emitEvent: false,
                        });
                        this.form.controls.department.setValue('', {
                            emitEvent: false,
                        });
                        this.form.controls.municipality.setValue('', {
                            emitEvent: false,
                        });
                        this.selectedRegionCode.set(null);
                        this.selectedDepartmentCode.set(null);
                    }

                    /* this.updateValidatorsForTargetType(targetType); */
                })
            )
            .subscribe();
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
            reportIdControl.enable({ emitEvent: false });
        } else {
            reportIdControl.clearValidators();
            reportIdControl.disable({ emitEvent: false });
        }
        reportIdControl.updateValueAndValidity({ emitEvent: false });

        const controls = [this.form.controls.region];

        if (!isReport) {
            controls.forEach((control) => {
                control.setValidators([Validators.required]);
                control.enable({ emitEvent: false });
                control.updateValueAndValidity({ emitEvent: false });
            });
        } else {
            controls.forEach((control) => {
                control.clearValidators();
                control.disable({ emitEvent: false });
                control.updateValueAndValidity({ emitEvent: false });
            });
        }
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

    private setupItemPatch(): void {
        effect(() => {
            const item = this.item();
            if (item && !this.itemPatched()) {
                this.form.patchValue(
                    {
                        reportId: item.reportId || '',
                        type: item.type,
                        targetType: item.targetType,
                        region: item.region || '',
                        department: item.department || '',
                        municipality: item.municipality || '',
                        channels: item.channels,
                        subject: item.subject,
                        content: item.content,
                    },
                    { emitEvent: false }
                );

                this.updateValidatorsForTargetType(item.targetType);

                this.itemPatched.set(true);
            }
        });
    }

    setEditMode(uniqId: string | null): void {
        this.isEditMode.set(!!uniqId);
        if (uniqId) {
            this.facade.read({ uniqId }, true);
        } else {
            this.form.reset();
            this.itemPatched.set(false);
            this.regionsFacade.readAll();
        }
    }
}
