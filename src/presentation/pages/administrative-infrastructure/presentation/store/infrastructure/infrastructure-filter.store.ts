import { Injectable, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { InfrastructureFilterDto } from '@pages/administrative-infrastructure/application/dto/infrastructure/infrastructure-filter.dto';
import { InfrastructureFacade } from '@pages/administrative-infrastructure/application/services/infrastructure/infrastructure.facade';
import { InfrastructureFilterControl } from '@pages/administrative-infrastructure/presentation/store/infrastructure/infrastructure-filter.control';
import { RegionsSelectFacade } from '@presentation/pages/administrative-boundary/application/services/regions/regions-select.facade';

@Injectable()
export class InfrastructureFilterStore {
    private readonly fb = inject(FormBuilder);
    private readonly facade = inject(InfrastructureFacade);
    private readonly regionsFacade = inject(RegionsSelectFacade);

    private readonly currentFilter = toSignal(this.facade.currentFilter$, {
        initialValue: null,
    });

    private readonly regions = toSignal(this.regionsFacade.items$, {
        initialValue: [],
    });

    readonly form: FormGroup<InfrastructureFilterControl> =
        this.fb.group<InfrastructureFilterControl>({
            search: new FormControl<string | undefined>(undefined, {
                nonNullable: true,
            }),
            type: new FormControl<string | undefined>(undefined, {
                nonNullable: true,
            }),
            region: new FormControl<string | undefined>(undefined, {
                nonNullable: true,
            }),
            department: new FormControl<string | undefined>(undefined, {
                nonNullable: true,
            }),
            municipality: new FormControl<string | undefined>(undefined, {
                nonNullable: true,
            }),
            position: new FormControl<string | undefined>(undefined, {
                nonNullable: true,
            }),

            startDate: new FormControl<string | undefined>(undefined, {
                nonNullable: true,
            }),

            endDate: new FormControl<string | undefined>(undefined, {
                nonNullable: true,
            }),
        });

    private readonly selectedRegion = toSignal(
        this.form.controls.region.valueChanges,
        {
            initialValue: this.form.controls.region.value,
        }
    );

    private readonly filteredDepartments = computed(() => {
        const regionId = this.selectedRegion();

        if (!regionId) {
            return [];
        }

        const region = this.regions().find((item) => item.value === regionId);
        return region?.departments ?? [];
    });

    private readonly isDepartmentDisabled = computed(
        () => !this.selectedRegion()
    );

    private readonly isMunicipalityDisabled = computed(
        () => !this.selectedDepartment()
    );

    private readonly selectedDepartment = toSignal(
        this.form.controls.department.valueChanges,
        {
            initialValue: this.form.controls.department.value,
        }
    );

    private readonly filteredMunicipalities = computed(() => {
        const departmentId = this.selectedDepartment();
        if (!departmentId) {
            return [];
        }
        for (const region of this.regions()) {
            const department = region.departments?.find(
                (d) => d.value === departmentId
            );
            if (department) {
                return department.municipalities ?? [];
            }
        }
        return [];
    });

    public readonly vm = computed(() => ({
        departments: this.filteredDepartments(),
        isDepartmentDisabled: this.isDepartmentDisabled(),
        municipalities: this.filteredMunicipalities(),
        isMunicipalityDisabled: this.isMunicipalityDisabled(),
    }));

    constructor() {
        this.initializeCascadeReset();
        const filter = this.currentFilter();

        if (!filter) {
            return;
        }

        this.form.patchValue(filter, {
            emitEvent: false,
        });
    }

    private resetControls(
        ...controls: (keyof InfrastructureFilterControl)[]
    ): void {
        controls.forEach((control) =>
            this.form.controls[control].reset(undefined, {
                emitEvent: true,
            })
        );
    }

    private initializeCascadeReset(): void {
        effect(() => {
            if (!this.selectedRegion()) {
                this.resetControls('department', 'municipality');
            }
        });

        effect(() => {
            if (!this.selectedDepartment()) {
                this.resetControls('municipality');
            }
        });
    }

    reset(): void {
        this.form.reset();
    }

    get value(): InfrastructureFilterDto {
        const raw = this.form.getRawValue();

        return {
            search: raw.search || undefined,
            type: raw.type || undefined,
            region: raw.region || undefined,
            department: raw.department || undefined,
            municipality: raw.municipality || undefined,
            position: raw.position || undefined,
            startDate: raw.startDate || undefined,
            endDate: raw.endDate || undefined,
        };
    }
}
