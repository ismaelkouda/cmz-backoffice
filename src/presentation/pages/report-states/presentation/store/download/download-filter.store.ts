import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DownloadFilterDto } from '@pages/report-states/application/dto/download/download-filter.dto';
import { DownloadFacade } from '@pages/report-states/application/services/download/download.facade';
import { Status } from '@pages/report-states/domain/enums/download/download-status.enum';
import { DownloadFilterControl } from '@pages/report-states/presentation/store/download/download-filter-control';
import { ReportType } from '@shared/domain/enums/report-type.enum';

@Injectable()
export class DownloadFilterStore {
    private readonly fb = inject(FormBuilder);
    private readonly facade = inject(DownloadFacade);

    private readonly currentFilter = toSignal(this.facade.currentFilter$, {
        initialValue: null,
    });

    readonly form: FormGroup<DownloadFilterControl> =
        this.fb.group<DownloadFilterControl>({
            search: new FormControl<string>('', {
                nonNullable: true,
            }),
            date: new FormControl<Date | undefined>(undefined, {
                nonNullable: true,
            }),
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
            status: new FormControl<Status | null>(null, {
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

    get value(): DownloadFilterDto {
        const raw = this.form.getRawValue();

        return {
            search: raw.search,
            date: raw.date,
            initiatorPhoneNumber: raw.initiatorPhoneNumber || undefined,
            uniqId: raw.uniqId || undefined,
            startDate: raw.startDate || undefined,
            endDate: raw.endDate || undefined,
            reportType: raw.reportType || undefined,
            source: raw.source || undefined,
            status: raw.status || undefined,
            operators: raw.operators?.length ? raw.operators : undefined,
        };
    }
}
