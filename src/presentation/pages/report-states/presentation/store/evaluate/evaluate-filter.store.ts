import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { EvaluateFilterDto } from '@pages/report-states/application/dto/evaluate/evaluate-filter.dto';
import { EvaluateFacade } from '@pages/report-states/application/services/evaluate/evaluate.facade';
import { EvaluateFilterControl } from '@pages/report-states/presentation/store/evaluate/evaluate-filter-control';
import { ReportType } from '@shared/domain/enums/report-type.enum';

@Injectable()
export class EvaluateFilterStore {
    private readonly fb = inject(FormBuilder);
    private readonly facade = inject(EvaluateFacade);

    private readonly currentFilter = toSignal(this.facade.currentFilter$, {
        initialValue: null,
    });

    readonly form: FormGroup<EvaluateFilterControl> =
        this.fb.group<EvaluateFilterControl>({
            initiatorPhoneNumber: new FormControl<string>('', {
                nonNullable: true,
            }),
            uniqId: new FormControl<string>('', {
                nonNullable: true,
            }),
            reportType: new FormControl<ReportType | null>(null, {
                nonNullable: true,
            }),
            operators: new FormControl<string[]>([], {
                nonNullable: true,
            }),
            source: new FormControl<string | null>(null, {
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

        this.form.patchValue(filter, {
            emitEvent: false,
        });
    }

    reset(): void {
        this.form.reset();
    }

    get value(): EvaluateFilterDto {
        const raw = this.form.getRawValue();

        return {
            initiatorPhoneNumber: raw.initiatorPhoneNumber || undefined,
            uniqId: raw.uniqId || undefined,
            startDate: raw.startDate || undefined,
            endDate: raw.endDate || undefined,
            reportType: raw.reportType || undefined,
            source: raw.source || undefined,
            operators: raw.operators?.length ? raw.operators : undefined,
        };
    }
}
