import {
    Injectable,
    inject,
    signal,
    computed,
    effect,
    untracked,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { RegionsSelectFacade } from '@pages/administrative-boundary/application/services/regions/regions-select.facade';
import { MessagingFindOneFacade } from '@pages/communication/application/services/messaging/messaging-find-one.facade';
import { MessagingFormControl } from '@presentation/pages/communication/presentation/store/messaging/messaging-form.control';
import { MessagingTargetEnum } from '@pages/communication/domain/enums/messaging/messaging-target.enum';
import { FormValidators } from '@pages/communication/domain/validators/form-validators';
import { getEnumKeyByValue } from '@shared/components/filter/filter.types';
import { filter, pairwise, startWith } from 'rxjs';

@Injectable()
export class MessagingFormStore {
    private readonly fb = inject(FormBuilder);

    private readonly findOneFacade = inject(MessagingFindOneFacade);

    private readonly regionsFacade = inject(RegionsSelectFacade);

    readonly VALIDATION = FormValidators;

    readonly form = this.createForm();

    readonly isDetailsMode = signal(false);

    readonly loading = computed(() => {
        return this.findOneFacade.loading();
    });

    readonly loadingRegions = toSignal(this.regionsFacade.isLoading$, {
        initialValue: false,
    });

    readonly status = toSignal(
        this.form.statusChanges.pipe(startWith(this.form.status)),
        {
            initialValue: this.form.status,
        }
    );

    readonly isValid = computed(() => {
        return this.status() === 'VALID';
    });

    readonly selectedRegionCode = toSignal(
        this.form.controls.region.valueChanges.pipe(
            startWith(this.form.controls.region.value)
        ),
        {
            initialValue: this.form.controls.region.value,
        }
    );

    readonly selectedDepartmentCode = toSignal(
        this.form.controls.department.valueChanges.pipe(
            startWith(this.form.controls.department.value)
        ),
        {
            initialValue: this.form.controls.department.value,
        }
    );

    readonly selectedTargetType = toSignal(
        this.form.controls.targetType.valueChanges.pipe(
            startWith(this.form.controls.targetType.value)
        ),
        {
            initialValue: this.form.controls.targetType.value,
        }
    );

    readonly isReportMode = computed(() => {
        return (
            this.selectedTargetType() ===
            getEnumKeyByValue(MessagingTargetEnum, MessagingTargetEnum.REPORT)
        );
    });

    readonly regions = toSignal(this.regionsFacade.items$, {
        initialValue: [],
    });

    readonly departments = computed(() => {
        const regionCode = this.selectedRegionCode();

        const regions = this.regions();

        if (!regionCode || !regions.length) {
            return [];
        }

        return (
            regions.find((region) => region.value === regionCode)
                ?.departments ?? []
        );
    });

    readonly municipalities = computed(() => {
        const departmentCode = this.selectedDepartmentCode();

        const regions = this.regions();

        if (!departmentCode || !regions.length) {
            return [];
        }

        const region = regions.find((region) =>
            region.departments?.some(
                (department) => department.value === departmentCode
            )
        );

        return (
            region?.departments?.find(
                (department) => department.value === departmentCode
            )?.municipalities ?? []
        );
    });

    private readonly item = this.findOneFacade.items;

    constructor() {
        this.initializeRegionListener();

        this.initializeDepartmentListener();

        this.initializeTargetTypeEffect();

        this.initializeDetailsModeEffect();
    }

    private createForm(): FormGroup<MessagingFormControl> {
        return this.fb.nonNullable.group<MessagingFormControl>({
            reportId: new FormControl('', {
                nonNullable: true,
            }),

            type: new FormControl(undefined, {
                nonNullable: true,
                validators: [Validators.required],
            }),

            targetType: new FormControl(undefined, {
                nonNullable: true,
                validators: [Validators.required],
            }),

            region: new FormControl('', {
                nonNullable: true,
            }),

            department: new FormControl('', {
                nonNullable: true,
            }),

            municipality: new FormControl('', {
                nonNullable: true,
            }),

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

    private initializeRegionListener(): void {
        toObservable(this.selectedRegionCode)
            .pipe(
                pairwise(),

                filter(([previous, current]) => {
                    return previous !== current && !this.isDetailsMode();
                })
            )
            .subscribe(() => {
                queueMicrotask(() => {
                    this.resetDepartmentAndMunicipality();

                    this.updateAdministrativeValidators();
                });
            });
    }

    private initializeDepartmentListener(): void {
        toObservable(this.selectedDepartmentCode)
            .pipe(
                pairwise(),

                filter(([previous, current]) => {
                    return previous !== current && !this.isDetailsMode();
                })
            )
            .subscribe(() => {
                queueMicrotask(() => {
                    this.resetMunicipality();

                    this.updateAdministrativeValidators();
                });
            });
    }

    private initializeTargetTypeEffect(): void {
        effect(() => {
            const targetType = this.selectedTargetType();

            const isDetails = this.isDetailsMode();

            untracked(() => {
                if (isDetails) {
                    return;
                }

                queueMicrotask(() => {
                    const isReport =
                        targetType ===
                        getEnumKeyByValue(
                            MessagingTargetEnum,
                            MessagingTargetEnum.REPORT
                        );

                    if (isReport) {
                        this.clearAdministrativeArea();
                    } else {
                        this.clearReportId();
                    }

                    this.updateTargetValidators(targetType ?? null);

                    this.updateAdministrativeValidators();
                });
            });
        });
    }

    private initializeDetailsModeEffect(): void {
        effect(() => {
            const item = this.item();

            const regions = this.regions();

            const isDetails = this.isDetailsMode();

            if (!item || !regions.length || !isDetails) {
                return;
            }

            untracked(() => {
                queueMicrotask(() => {
                    this.form.patchValue({
                        reportId: item.reportId ?? '',

                        type: item.type,

                        targetType: item.targetType,

                        region: item.region,

                        department: item.department,

                        municipality: item.municipality,

                        channels: item.channels,

                        subject: item.subject,

                        content: item.content,
                    });

                    this.updateTargetValidators(item.targetType);

                    this.updateAdministrativeValidators();

                    this.form.disable({
                        emitEvent: false,
                    });
                });
            });
        });
    }

    private updateTargetValidators(targetType: string | null): void {
        const reportIdControl = this.form.controls.reportId;

        const isReport =
            targetType ===
            getEnumKeyByValue(MessagingTargetEnum, MessagingTargetEnum.REPORT);

        if (isReport) {
            reportIdControl.setValidators([
                Validators.required,

                Validators.minLength(FormValidators.REPORT_ID.MIN),

                Validators.maxLength(FormValidators.REPORT_ID.MAX),

                Validators.pattern(FormValidators.REPORT_ID.PATTERN),
            ]);
        } else {
            reportIdControl.clearValidators();
        }

        reportIdControl.updateValueAndValidity({
            emitEvent: false,
        });
    }

    private updateAdministrativeValidators(): void {
        const isReport = this.isReportMode();

        const regionControl = this.form.controls.region;

        const departmentControl = this.form.controls.department;

        const municipalityControl = this.form.controls.municipality;

        if (isReport) {
            regionControl.clearValidators();

            departmentControl.clearValidators();

            municipalityControl.clearValidators();

            regionControl.updateValueAndValidity({
                emitEvent: false,
            });

            departmentControl.updateValueAndValidity({
                emitEvent: false,
            });

            municipalityControl.updateValueAndValidity({
                emitEvent: false,
            });

            return;
        }

        regionControl.setValidators([Validators.required]);

        // if (regionControl.value) {
        //     departmentControl.setValidators([Validators.required]);
        // } else {
        //     departmentControl.clearValidators();
        // }

        // if (departmentControl.value) {
        //     municipalityControl.setValidators([Validators.required]);
        // } else {
        //     municipalityControl.clearValidators();
        // }

        // regionControl.updateValueAndValidity({
        //     emitEvent: false,
        // });

        // departmentControl.updateValueAndValidity({
        //     emitEvent: false,
        // });

        // municipalityControl.updateValueAndValidity({
        //     emitEvent: false,
        // });
    }

    private resetDepartmentAndMunicipality(): void {
        const department = this.form.controls.department.value;

        const municipality = this.form.controls.municipality.value;

        if (!department && !municipality) {
            return;
        }

        this.form.patchValue(
            {
                department: '',
                municipality: '',
            },
            {
                emitEvent: false,
            }
        );
    }

    private resetMunicipality(): void {
        const municipality = this.form.controls.municipality.value;

        if (!municipality) {
            return;
        }

        this.form.patchValue(
            {
                municipality: '',
            },
            {
                emitEvent: false,
            }
        );
    }

    private clearAdministrativeArea(): void {
        const { region, department, municipality } = this.form.getRawValue();

        if (!region && !department && !municipality) {
            return;
        }

        this.form.patchValue(
            {
                region: '',
                department: '',
                municipality: '',
            },
            {
                emitEvent: false,
            }
        );
    }

    private clearReportId(): void {
        const reportId = this.form.controls.reportId.value;

        if (!reportId) {
            return;
        }

        this.form.patchValue(
            {
                reportId: '',
            },
            {
                emitEvent: false,
            }
        );
    }

    setDetailsMode(uniqId: string | null): void {
        const isDetails = !!uniqId;

        this.isDetailsMode.set(isDetails);

        this.regionsFacade.readAll();

        if (isDetails && uniqId) {
            this.findOneFacade.read(
                {
                    uniqId,
                },
                {
                    forceRefresh: true,
                }
            );

            return;
        }

        this.reset();

        this.findOneFacade.reset();
    }

    reset(): void {
        this.form.enable({
            emitEvent: false,
        });

        this.form.reset(
            {
                reportId: '',
                type: undefined,
                targetType: undefined,
                region: '',
                department: '',
                municipality: '',
                channels: [],
                subject: '',
                content: '',
            },
            {
                emitEvent: true,
            }
        );

        this.isDetailsMode.set(false);

        this.updateTargetValidators(null);

        this.updateAdministrativeValidators();

        this.form.markAsPristine();

        this.form.markAsUntouched();
    }
}
