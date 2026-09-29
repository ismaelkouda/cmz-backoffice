import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SlaFilterDto } from '@pages/sla/application/dto/sla/sla-filter.dto';
import { SlaFacade } from '@pages/sla/application/services/sla/sla.facade';
import { SlaFilterControl } from '@pages/sla/presentation/store/sla/sla-filter.control';

@Injectable()
export class SlaFilterStore {
    private readonly fb = inject(FormBuilder);
    private readonly facade = inject(SlaFacade);

    private readonly currentFilter = toSignal(this.facade.currentFilter$, {
        initialValue: null,
    });

    readonly form: FormGroup<SlaFilterControl> =
        this.fb.group<SlaFilterControl>({
            search: new FormControl<string>('', {
                nonNullable: true,
            }),
            category: new FormControl<string | null>(null),
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

    get value(): SlaFilterDto {
        const raw = this.form.getRawValue();

        return {
            search: raw.search || undefined,
            category: raw.category || undefined,
        };
    }
}
