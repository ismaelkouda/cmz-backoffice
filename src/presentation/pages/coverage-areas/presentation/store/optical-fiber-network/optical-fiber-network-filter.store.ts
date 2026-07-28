import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Operator } from '@pages/coverage-areas/domain/enums/optical-fiber-network/optical-fiber-network-operator.enum';
import { OpticalFiberNetworkFilterDto } from '@pages/coverage-areas/application/dto/optical-fiber-network/optical-fiber-network-filter.dto';
import { OpticalFiberNetworkFacade } from '@pages/coverage-areas/application/services/optical-fiber-network/optical-fiber-network.facade';
import { OpticalFiberNetworkFilterControl } from '@pages/coverage-areas/presentation/store/optical-fiber-network/optical-fiber-network-filter.control';

@Injectable()
export class OpticalFiberNetworkFilterStore {
    private readonly fb = inject(FormBuilder);
    private readonly facade = inject(OpticalFiberNetworkFacade);

    private readonly currentFilter = toSignal(this.facade.currentFilter$, {
        initialValue: null,
    });

    readonly form: FormGroup<OpticalFiberNetworkFilterControl> =
        this.fb.group<OpticalFiberNetworkFilterControl>({
            search: new FormControl<string | undefined>(undefined, {
                nonNullable: true,
            }),
            operator: new FormControl<Operator | undefined>(undefined, {
                nonNullable: true,
            }),
            startDate: new FormControl<Date | undefined>(undefined, {
                nonNullable: true,
            }),
            endDate: new FormControl<Date | undefined>(undefined, {
                nonNullable: true,
            }),
        });

    constructor() {
        const filter = this.currentFilter();
        if (!filter) {
            return;
        }
        this.form.patchValue(filter, { emitEvent: false });
    }

    reset(): void {
        this.form.reset();
    }

    get value(): OpticalFiberNetworkFilterDto {
        const raw = this.form.getRawValue();
        return {
            search: raw.search || undefined,
            operator: raw.operator || undefined,
            startDate: raw.startDate || undefined,
            endDate: raw.endDate || undefined,
        };
    }
}
