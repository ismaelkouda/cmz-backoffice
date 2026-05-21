import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HistoryFilterDto } from '@shared/components/history/application/dto/history-filter.dto';
import { HistoryFacade } from '@shared/components/history/application/services/history.facade';
import { HistoryFilterControl } from '@shared/components/history/presentation/store/history-filter-control';

@Injectable()
export class HistoryFilterStore {
    private readonly fb = inject(FormBuilder);
    private readonly facade = inject(HistoryFacade);

    private readonly currentFilter = toSignal(this.facade.currentFilter$, {
        initialValue: null,
    });

    readonly form: FormGroup<HistoryFilterControl> =
        this.fb.group<HistoryFilterControl>({
            search: new FormControl<string>('', {
                nonNullable: true,
            }),
            startDate: new FormControl<string>('', {
                nonNullable: true,
            }),
            endDate: new FormControl<string>('', {
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

    public value(typeModel: string, module: string): HistoryFilterDto {
        const raw = this.form.getRawValue();

        return {
            typeModel,
            module,
            search: raw.search,
            startDate: raw.startDate || undefined,
            endDate: raw.endDate || undefined,
        };
    }
}
