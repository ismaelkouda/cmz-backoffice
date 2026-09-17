import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AdmissibleFilterDto } from '@pages/report-states/application/dto/admissible/admissible-filter.dto';
import { AdmissibleFacade } from '@pages/report-states/application/services/admissible/admissible.facade';
import { AdmissibleFilterControl } from '@pages/report-states/presentation/store/admissible/admissible-filter-control';
import { AdmissibleDownloadDto } from '@presentation/pages/report-states/application/dto/admissible/admissible-download.dto';
import { DownloadType } from '@presentation/pages/report-states/domain/enums/download-type.enum';
import { ReportType } from '@shared/domain/enums/report-type.enum';

@Injectable()
export class AdmissibleFilterStore {
    private readonly fb = inject(FormBuilder);
    private readonly facade = inject(AdmissibleFacade);

    private readonly currentFilter = toSignal(this.facade.currentFilter$, {
        initialValue: null,
    });

    readonly form: FormGroup<AdmissibleFilterControl> =
        this.fb.group<AdmissibleFilterControl>({
            initiatorPhoneNumber: new FormControl<string>('', {
                nonNullable: true,
            }),
            uniqId: new FormControl<string>('', {
                nonNullable: true,
            }),
            requestReportUniqId: new FormControl<string>('', {
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

    get value(): AdmissibleFilterDto {
        const raw = this.form.getRawValue();

        return {
            initiatorPhoneNumber: raw.initiatorPhoneNumber || undefined,
            uniqId: raw.uniqId || undefined,
            requestReportUniqId: raw.requestReportUniqId || undefined,
            startDate: raw.startDate || undefined,
            endDate: raw.endDate || undefined,
            reportType: raw.reportType || undefined,
            source: raw.source || undefined,
            operators: raw.operators?.length ? raw.operators : undefined,
        };
    }

    downloadValue(format: DownloadType): AdmissibleDownloadDto {
        const raw = this.form.getRawValue();

        return {
            format,
            initiatorPhoneNumber: raw.initiatorPhoneNumber || undefined,
            uniqId: raw.uniqId || undefined,
            requestReportUniqId: raw.requestReportUniqId || undefined,
            startDate: raw.startDate || undefined,
            endDate: raw.endDate || undefined,
            reportType: raw.reportType || undefined,
            source: raw.source || undefined,
            operators: raw.operators?.length ? raw.operators : undefined,
        };
    }
}
