import { Injectable, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MunicipalitiesFilterDto } from '@pages/administrative-boundary/application/dto/municipalities/municipalities-filter.dto';
import { MunicipalitiesFacade } from '@pages/administrative-boundary/application/services/municipalities/municipalities.facade';
import { RegionsSelectFacade } from '@pages/administrative-boundary/application/services/regions/regions-select.facade';

import { MunicipalitiesFilterControl } from './municipalities-filter.control';

@Injectable()
export class MunicipalitiesFilterStore {
    private readonly fb = inject(FormBuilder);

    private readonly facade = inject(MunicipalitiesFacade);

    private readonly regionsFacade = inject(RegionsSelectFacade);

    private readonly currentFilter = toSignal(this.facade.currentFilter$, {
        initialValue: null,
    });

    private readonly regions = toSignal(this.regionsFacade.items$, {
        initialValue: [],
    });

    readonly form: FormGroup<MunicipalitiesFilterControl> =
        this.fb.group<MunicipalitiesFilterControl>({
            search: new FormControl<string | null>(null),

            region: new FormControl<string | null>(null),

            department: new FormControl<string | null>({
                value: null,
                disabled: true,
            }),

            startDate: new FormControl<string | null>(null),

            endDate: new FormControl<string | null>(null),
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

    public readonly vm = computed(() => ({
        departments: this.filteredDepartments(),
        isDepartmentDisabled: this.isDepartmentDisabled(),
    }));

    constructor() {
        this.initializeForm();
        this.handleRegionChanges();
    }

    private initializeForm(): void {
        const filter = this.currentFilter();

        if (!filter) {
            return;
        }

        this.form.patchValue(filter, {
            emitEvent: false,
        });

        if (filter.region) {
            this.form.controls.department.enable({
                emitEvent: false,
            });
        }
    }

    private handleRegionChanges(): void {
        effect(() => {
            const region = this.selectedRegion();
            const departmentControl = this.form.controls.department;
            const availableDepartments = this.filteredDepartments();

            if (!region) {
                departmentControl.disable({ emitEvent: false });
                departmentControl.reset(null, { emitEvent: false });
                return;
            }

            departmentControl.enable({ emitEvent: false });

            const currentDeptValue = departmentControl.value;
            const stillExists = availableDepartments.some(
                (dept) => dept.value === currentDeptValue
            );

            if (!stillExists && currentDeptValue !== null) {
                departmentControl.reset(null, { emitEvent: false });
            }
        });
    }

    reset(): void {
        this.form.reset();

        this.form.controls.department.disable({
            emitEvent: false,
        });
    }

    get value(): MunicipalitiesFilterDto {
        const raw = this.form.getRawValue();

        return {
            search: raw.search,
            region: raw.region,
            department: raw.department,
            startDate: raw.startDate,
            endDate: raw.endDate,
        };
    }
}
