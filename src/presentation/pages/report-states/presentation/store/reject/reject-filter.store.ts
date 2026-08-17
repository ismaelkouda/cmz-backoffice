import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { RejectFilterDto } from '@pages/report-states/application/dto/reject/reject-filter.dto';
import { RejectFacade } from '@pages/report-states/application/services/reject/reject.facade';
import { Status } from '@pages/report-states/domain/enums/reject/reject-status.enum';
import { RejectFilterControl } from '@pages/report-states/presentation/store/reject/reject-filter-control';
import { RejectDownloadDto } from '@presentation/pages/report-states/application/dto/reject/reject-download.dto';
import { DownloadType } from '@presentation/pages/report-states/domain/enums/download-type.enum';
import { ReportType } from '@shared/domain/enums/report-type.enum';

@Injectable()
export class RejectFilterStore {
    private readonly fb = inject(FormBuilder);
    private readonly facade = inject(RejectFacade);

    private readonly currentFilter = toSignal(this.facade.currentFilter$, {
        initialValue: null,
    });

    readonly form: FormGroup<RejectFilterControl> =
        this.fb.group<RejectFilterControl>({
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

    get value(): RejectFilterDto {
        const raw = this.form.getRawValue();

        return {
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

    downloadValue(format: DownloadType): RejectDownloadDto {
        const raw = this.form.getRawValue();

        return {
            format,
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
