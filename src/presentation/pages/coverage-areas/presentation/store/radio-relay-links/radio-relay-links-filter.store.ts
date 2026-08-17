import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { RadioRelayLinksOperator } from '@pages/coverage-areas/domain/enums/radio-relay-links/radio-relay-links-operator.enum';
import { RadioRelayLinksFrequency } from '@pages/coverage-areas/domain/enums/radio-relay-links/radio-relay-links-frequency.enum';
import { RadioRelayLinksFilterDto } from '@pages/coverage-areas/application/dto/radio-relay-links/radio-relay-links-filter.dto';
import { RadioRelayLinksFacade } from '@pages/coverage-areas/application/services/radio-relay-links/radio-relay-links.facade';
import { RadioRelayLinksFilterControl } from './radio-relay-links-filter.control';

@Injectable()
export class RadioRelayLinksFilterStore {
    private readonly fb = inject(FormBuilder);
    private readonly facade = inject(RadioRelayLinksFacade);

    private readonly currentFilter = toSignal(this.facade.currentFilter$, {
        initialValue: null,
    });

    readonly form: FormGroup<RadioRelayLinksFilterControl> =
        this.fb.group<RadioRelayLinksFilterControl>({
            search: new FormControl<string | undefined>(undefined, {
                nonNullable: true,
            }),
            operator: new FormControl<RadioRelayLinksOperator | undefined>(
                undefined,
                { nonNullable: true }
            ),
            frequency: new FormControl<RadioRelayLinksFrequency | undefined>(
                undefined,
                { nonNullable: true }
            ),
            startDate: new FormControl<Date | undefined>(undefined, {
                nonNullable: true,
            }),
            endDate: new FormControl<Date | undefined>(undefined, {
                nonNullable: true,
            }),
        });

    constructor() {
        const filter = this.currentFilter();
        if (filter) {
            this.form.patchValue(filter, { emitEvent: false });
        }
    }

    get value(): RadioRelayLinksFilterDto {
        const raw = this.form.getRawValue();
        return {
            search: raw.search || undefined,
            operator: raw.operator || undefined,
            frequency: raw.frequency || undefined,
            startDate: raw.startDate || undefined,
            endDate: raw.endDate || undefined,
        };
    }

    reset(): void {
        this.form.reset();
    }
}
