import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Status } from '@presentation/pages/administrative-infrastructure/domain/enums/infrastructure-type/infrastructure-type-status.enum';
import { InfrastructureTypeFilterDto } from '@pages/administrative-infrastructure/application/dto/infrastructure-type/infrastructure-type-filter.dto';
import { InfrastructureTypeFacade } from '@pages/administrative-infrastructure/application/services/infrastructure-type/infrastructure-type.facade';
import { InfrastructureTypeFilterControl } from '@pages/administrative-infrastructure/presentation/store/infrastructure-type/infrastructure-type-filter.control';
import { INFRASTRUCTURE_TYPE_FILTER_KEYS } from '@presentation/pages/administrative-infrastructure/presentation/constants/infrastructure-type/infrastructure-type-filter-keys.constant';

@Injectable()
export class InfrastructureTypeFilterStore {
    private readonly fb = inject(FormBuilder);
    private readonly facade = inject(InfrastructureTypeFacade);

    private readonly currentFilter = toSignal(this.facade.currentFilter$, {
        initialValue: null,
    });

    readonly form: FormGroup<InfrastructureTypeFilterControl> =
        this.fb.group<InfrastructureTypeFilterControl>({
            [INFRASTRUCTURE_TYPE_FILTER_KEYS.SEARCH]: new FormControl<
                string | undefined
            >(undefined, {
                nonNullable: true,
            }),
            [INFRASTRUCTURE_TYPE_FILTER_KEYS.STATUS]: new FormControl<
                Status | undefined
            >(undefined, {
                nonNullable: true,
            }),
            [INFRASTRUCTURE_TYPE_FILTER_KEYS.START_DATE]: new FormControl<
                Date | undefined
            >(undefined, {
                nonNullable: true,
            }),

            [INFRASTRUCTURE_TYPE_FILTER_KEYS.END_DATE]: new FormControl<
                Date | undefined
            >(undefined, {
                nonNullable: true,
            }),
        });

    constructor() {
        const filter = this.currentFilter();

        if (!filter) {
            return;
        }

        this.form.patchValue(filter, {
            emitEvent: false,
        });
    }

    reset(): void {
        this.form.reset();
    }

    get value(): InfrastructureTypeFilterDto {
        const raw = this.form.getRawValue();

        return {
            [INFRASTRUCTURE_TYPE_FILTER_KEYS.SEARCH]:
                raw[INFRASTRUCTURE_TYPE_FILTER_KEYS.SEARCH] || undefined,
            [INFRASTRUCTURE_TYPE_FILTER_KEYS.STATUS]:
                raw[INFRASTRUCTURE_TYPE_FILTER_KEYS.STATUS] || undefined,
            [INFRASTRUCTURE_TYPE_FILTER_KEYS.START_DATE]:
                raw[INFRASTRUCTURE_TYPE_FILTER_KEYS.START_DATE] || undefined,
            [INFRASTRUCTURE_TYPE_FILTER_KEYS.END_DATE]:
                raw[INFRASTRUCTURE_TYPE_FILTER_KEYS.END_DATE] || undefined,
        };
    }
}
