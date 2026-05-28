import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { Status } from '@pages/content-management/domain/enums/terms-use/terms-use-status.enum';
import { TermsUseFilterDto } from '@presentation/pages/content-management/application/dto/terms-use/terms-use-filter.dto';
import { TermsUseFacade } from '@presentation/pages/content-management/application/services/terms-use/terms-use.facade';
import { TermsUseFilterControl } from '@presentation/pages/content-management/application/store/terms-use/terms-use-filter.control';
import { semanticVersionValidator } from '@shared/domain/functions/semantic-version-validator';

@Injectable()
export class TermsUseFilterStore {
    private readonly fb = inject(FormBuilder);
    private readonly facade = inject(TermsUseFacade);

    private readonly currentFilter = toSignal(this.facade.currentFilter$, {
        initialValue: null,
    });

    readonly form: FormGroup<TermsUseFilterControl> =
        this.fb.group<TermsUseFilterControl>({
            search: new FormControl<string | undefined>(undefined, {
                nonNullable: true,
            }),
            version: new FormControl<string | undefined>(undefined, {
                validators: [
                    semanticVersionValidator(),
                    Validators.pattern(/^\d+(\.\d+){0,2}$/),
                ],
                nonNullable: true,
            }),
            status: new FormControl<Status | undefined>(undefined, {
                nonNullable: true,
            }),
            startDate: new FormControl<string | undefined>(undefined, {
                nonNullable: true,
            }),
            endDate: new FormControl<string | undefined>(undefined, {
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

    get value(): TermsUseFilterDto {
        const raw = this.form.getRawValue();

        return {
            search: raw.search || undefined,
            version: raw.version || undefined,
            status: raw.status || undefined,
            startDate: raw.startDate || undefined,
            endDate: raw.endDate || undefined,
        };
    }
}
